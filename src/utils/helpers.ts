import path from 'node:path';

import { type Translate, translate } from 'free-translate';

export const DATA_PATH = path.resolve(path.join(process.cwd(), './data'));
export const DATA_FILE = path.join(DATA_PATH, 'statistics.json');

export function getWeekIndex(): number {
	const date = new Date();
	return Math.round(date.getDate() / 7);
}

export function tokenTimeExpirationChecker(t: number) {
	const now = new Date();
	return now.getTime() <= t;
}

export const useTranslator = async (
	text: string,
	options: Translate = { to: 'en' },
) => {
	return await translate(text, options);
};
