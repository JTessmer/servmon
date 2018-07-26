const os = require('os');
const timeout = require('util').promisify( setTimeout );

// Reduces multiple time values to only active or idle
function simplifyTimes(time) {
	const activeOnly = { ...time, idle: 0 };

	return {
		active: Object.values(activeOnly).reduce( (a,b) => a+b ),
		idle: time.idle
	};
}

function getActivePercent(active, idle) {
	const max = active + idle;

	return Math.round( active / max * 1000 ) / 10;
}

module.exports = (req, res, next) => {

	const startTime = os.cpus();

	async function respond() {
		// We need to determine the difference over time, so wait a second to re-test
		await timeout(1000);

		const endTime = os.cpus();

		const cpus = [];
		const total = {
			active: 0,
			idle: 0,
			pct: 0
		};

		startTime.forEach( (cpu, i) => {
			const start = simplifyTimes(startTime[i].times);
			const end = simplifyTimes(endTime[i].times);

			const activeDelta = end.active - start.active;
			const idleDelta = end.idle - start.idle;

			total.active += activeDelta;
			total.idle += idleDelta;

			cpus[i] = {
				active: activeDelta,
				idle: idleDelta,
				pct: getActivePercent(activeDelta, idleDelta)
			};

		});

		res.json({
			cpus,
			total: {
				...total,
				pct: getActivePercent(total.active, total.idle)
			}
		});
	}

	respond();
}
