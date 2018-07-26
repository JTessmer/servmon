const os = require('os');
const exec = require('util').promisify( require('child_process').exec );

const { getHumanFilesize } = require('../helper/data');

module.exports = (req, res, next) => {

	async function respond() {
		const {stdout, stderr} = await exec('df -B 1 | grep -v Filesystem | grep -v tmpfs | grep -v udev');

		const disks = [];
		const total = {
			size: 0,
			used: 0,
			avail: 0
		}

		const resultLines = stdout.split('\n');

		resultLines.filter(line => line.length).map(line => {
			const lineItems = line.split(/\s+/);

			const itemSize = parseInt(lineItems[1]);
			const itemUsed = parseInt(lineItems[2]);
			const itemAvail = parseInt(lineItems[3]);

			total.size += itemSize;
			total.used += itemUsed;
			total.avail += itemAvail;

			disks.push({
				mount: lineItems[5],
				avail: getHumanFilesize(itemAvail),
				used: getHumanFilesize(itemUsed),
				size: getHumanFilesize(itemSize),
				pct: lineItems[4]
			});
		});

		res.json({
			disks,
			total: {
				avail: getHumanFilesize(total.avail),
				used: getHumanFilesize(total.used),
				size: getHumanFilesize(total.size),
				pct: Math.round( total.avail / total.used * 100 ) + '%'
			}
		});
	}

	respond();
}
