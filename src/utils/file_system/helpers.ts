import crypto from 'node:crypto';
import fs, { promises as fsP } from 'node:fs';
import path from 'node:path';

export const purgeFiles = (file: string, keepingFiles: string[]) => {
	const STATIC_DIR = path.resolve(process.cwd(), './static');

	const filePath = file.split('/');
	filePath.pop();
	const scanDir = filePath.join('/');
	const DIR = path.join(STATIC_DIR, scanDir);

	try {
		const dirFiles = fs.readdirSync(DIR);
		dirFiles.forEach((file) => {
			if (!keepingFiles.includes(file)) {
				fs.rmSync(path.join(DIR, file));
			}
		});
	} catch (error) {
		console.error(`Error during the ${DIR} dir purging:`, error);
	}
};

export const purgeSingleFile = (path: string) => {
	try {
		fs.rmSync(path);
	} catch (err) {
		console.error(err);
	}
};

/**
 * Function to rename a file using its location returns false if the operation fails and the file new full name if not
 * @param file {formidable.File}
 * @param pathTo {string}
 */
export const renaming = async (file: File, pathTo: string) => {
	const ext = path.extname(file.name);
	const date = new Date();
	const r = crypto.randomInt(date.getTime()).toString();
	const fName = `${date.getTime().toString() + r}${ext}`;
	console.log(fName);
	const xPath = path.resolve(process.cwd(), pathTo);
	const uploadPath = path.join(xPath, fName);
	try {
		const arrayBuffer = await file.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		await Bun.write(uploadPath, uint8Array);
		return fName;
	} catch (err) {
		console.error(err);
		return false;
	}
};

export function ensureDirectoryAccess(directory: string) {
	try {
		fs.accessSync(directory, fs.constants.W_OK);
	} catch (error) {
		console.error(`Folder access error : ${directory}`);
		console.error(`Error : ${(error as { message: string }).message}`);

		try {
			fs.mkdirSync(directory, { recursive: true, mode: 0o755 });
			console.log(`Folder created : ${directory}`);
		} catch (mkdirError) {
			console.error(
				`Error creating folder : ${(mkdirError as { message: string }).message}`,
			);
			throw mkdirError;
		}
	}
}

export async function createDirIfNotExists(path: string) {
	if (!fs.existsSync(path)) {
		await fsP.mkdir(path);
	}
	return;
}
