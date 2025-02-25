export function parseTimeToMilliseconds(timeString: string): number {
	const timeUnit = timeString.slice(-1);
	const timeValue = parseInt(timeString.slice(0, -1), 10);

	switch (timeUnit) {
		case "s":
			return timeValue * 1000;
		case "m":
			return timeValue * 60 * 1000;
		case "h":
			return timeValue * 60 * 60 * 1000;
		case "d":
			return timeValue * 24 * 60 * 60 * 1000;
		case "w":
			return timeValue * 7 * 24 * 60 * 60 * 1000;
		default:
			throw new Error(`Unknown time unit: ${timeUnit}`);
	}
}
