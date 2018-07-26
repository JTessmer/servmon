module.exports = {
	getHumanFilesize(bytes, useSI, startUnit) {
		const threshold = useSI ? 1000 : 1024;

		if ( Math.abs(bytes) < threshold ) {
			return bytes + ' B';
		}

		const units = useSI
			? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
			: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

		let unitPos = startUnit || -1;

		do {
			bytes /= threshold;
			++unitPos;
		} while ( Math.abs(bytes) >= threshold && unitPos < units.length - 1 );

		return bytes.toFixed(1) + ' ' + units[unitPos];
	}
}
