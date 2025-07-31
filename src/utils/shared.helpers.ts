import {
	// formatDistanceToNow,
	// formatDuration,
	intervalToDuration,
} from 'date-fns';

export const ensureUrlEnd = (url: string) =>
	url.endsWith('/') ? url : `${url}/`;

export function getTimeElapsed(date: Date) {
	const duration = intervalToDuration({ start: date, end: new Date() });

	if (duration.months && duration.months >= 1) {
		return `${duration.months}M`;
	}
	if (duration.weeks && duration.weeks >= 1) {
		return `${duration.weeks}W`;
	}
	if (duration.days && duration.days >= 1) {
		return `${duration.days}d`;
	}
	if (duration.hours && duration.hours >= 1) {
		return `${duration.hours}h`;
	}
	if (duration.minutes && duration.minutes >= 1) {
		return `${duration.minutes}m`;
	}
	if (duration.seconds && duration.seconds >= 1) {
		return `${duration.seconds}s`;
	}

	return 'now';
}
