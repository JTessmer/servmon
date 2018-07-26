const os = require('os');
const exec = require('util').promisify( require('child_process').exec );

const { getHumanFilesize } = require('../helper/data');

module.exports = (req, res, next) => {

	async function respond() {
		const {stdout, stderr} = await exec('free -b');

		const resultLines = stdout.split('\n');
		const memoryLine = resultLines[1].split(/\s+/);
		const swapLine = resultLines[2].split(/\s+/);

		res.json({
			memory: {
				total: getHumanFilesize( memoryLine[1] ),
				used: getHumanFilesize( memoryLine[2] ),
				percent: Math.round( (memoryLine[2] / memoryLine[1]) * 100 ) + '%'
			},
			swap: {
				total: getHumanFilesize( swapLine[1] ),
				used: getHumanFilesize( swapLine[2] ),
				percent: Math.round( (swapLine[2] / swapLine[1]) * 100 ) + '%'
			}
		});
	}

	respond();

}
