const os = require('os');
const exec = require('util').promisify( require('child_process').exec );

module.exports = (req, res, next) => {

	async function respond() {
		const {stdout, stderr} = await exec('ps -eo pcpu,pmem,time,args | sort -k 1 -r | head -n10');

		const processes = stdout.split('\n').splice(1);

		const formattedProcesses = [];

		processes.forEach( process => {
			const processInfo = process.split(/\s+/);
			processInfo.shift();
			processInfo.splice(4);

			formattedProcesses.push({
				cpu: processInfo[0],
				mem: processInfo[1],
				time: processInfo[2],
				cmd: processInfo[3]
			})
		});

		res.json(formattedProcesses);
	}

	respond();

}
