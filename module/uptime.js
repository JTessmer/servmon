const os = require('os');

module.exports = (req, res, next) => {
	const secondsInDay = 86400;
	const secondsInHour = 3600;
	const secondsInMinute = 60;

	const uptime = os.uptime();
	let remainingTime = uptime;

	const days = Math.floor(uptime / secondsInDay);
	remainingTime = uptime % secondsInDay;

	const hours = Math.floor(remainingTime / secondsInHour);
	remainingTime = remainingTime % secondsInHour;

	const minutes = Math.floor(remainingTime / secondsInMinute);
	const seconds = remainingTime % secondsInMinute;

	res.json({
		raw: uptime,
		days,
		hours,
		minutes,
		seconds,
		formatted: (days ? days+'d ' : '') + (hours ? hours+'h ' : '') + (minutes ? minutes+'m ' : '') + seconds + 's'
	});
}
