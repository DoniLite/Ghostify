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

/**
 * returns the first two characters of a user's name
 * @param name string
 * @returns string
 */
export function getInitials(name: string, toUpperCase = true) {
	if (!name) {
		return '';
	} // Handle empty input

	const words = name.trim().split(/\s+/); // Split by spaces
	const initials =
		words.length > 1
			? // biome-ignore lint/style/noNonNullAssertion: Assuming this will never be empty
				words[0]![0]! + words[1]![0]! // First character of first and second word
			: // biome-ignore lint/style/noNonNullAssertion: Assuming this will never be empty
				words[0]![0]! + words[0]![words[0]!.length - 1]; // First and last character if one word}

	return toUpperCase ? initials.toUpperCase() : initials;
}

export function ImageToBase64 (inputElement: HTMLInputElement): Promise<string> {
	// Returns a Promise that resolves with the base64 string
	return new Promise((resolve, reject) => {
		const file = inputElement.files?.[0];
		if (!file) {
			// Reject or resolve with null/undefined depending on desired behavior for "no file"
			// Rejecting might be better as the operation couldn't be performed.
			reject(new Error('No file selected.'));
			// Alternatively: resolve(null);
			return;
		}

		if (!file.type.startsWith('image/')) {
			reject(new Error(`File is not an image: ${file.type}`));
			return;
		}

		const reader = new FileReader();

		reader.onload = (e) => {
			const base64String = e.target?.result;
			if (typeof base64String === 'string') {
				resolve(base64String);
			} else {
				// This case is unlikely with readAsDataURL but good to handle
				reject(new Error('FileReader result was not a string.'));
			}
		};

		reader.onerror = (err) => {
			// Reject with the reader's error object or a new Error
			reject(reader.error || new Error(`FileReader error: ${err}`));
		};

		reader.readAsDataURL(file);
	});
}
