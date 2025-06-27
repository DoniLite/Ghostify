import crypto from 'node:crypto';
import fs, { promises as fsP } from 'node:fs';
import path from 'node:path';
import { verifyJWT } from '../security/jwt.ts';

export const purgeFiles = (files: string[]) => {
	const STATIC_DIR = path.resolve(Deno.cwd(), './static');

	// Vérifie que le tableau des fichiers n'est pas vide avant de continuer
	if (files.length === 0) {
		return;
	}

	// Vérifie les tokens pour chaque fichier (vérifie que `verifyJWT` retourne une chaîne pour chaque fichier)
	const processedFiles = files.map(
		(file) => verifyJWT(file) as unknown as string,
	);

	// Obtient le chemin d'architecture de dossiers en utilisant le premier fichier comme référence
	const filePath = processedFiles[0].split('/');
	filePath.pop(); // Retire le nom du fichier, gardant ainsi le chemin du dossier
	const scanDir = filePath.join('/');
	const DIR = path.join(STATIC_DIR, scanDir);

	try {
		const keepingFiles = processedFiles.map((f) => {
			const eachFilePath = f.split('/');
			return eachFilePath.pop(); // Récupère uniquement le nom du fichier
		});

		// Récupère les fichiers actuels dans le dossier
		const dirFiles = fs.readdirSync(DIR);

		// Parcours et supprime les fichiers qui ne sont pas dans `keepingFiles`
		dirFiles.forEach((file) => {
			if (!keepingFiles.includes(file)) {
				fs.rmSync(path.join(DIR, file));
			}
		});
	} catch (error) {
		console.error(
			`Erreur lors de la purge des fichiers dans le dossier ${DIR}:`,
			error,
		);
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
	const xPath = path.resolve(Deno.cwd(), pathTo);
	const uploadPath = path.join(xPath, fName);
	try {
		// Convertir le fichier en tableau de bytes
		const arrayBuffer = await file.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		// Stocker le fichier
		await Deno.writeFile(uploadPath, uint8Array);
		return fName;
	} catch (err) {
		console.error(err);
		return false;
	}
};

export function ensureDirectoryAccess(directory: string) {
	try {
		// Vérifie si le dossier existe et est accessible
		fs.accessSync(directory, fs.constants.W_OK);
	} catch (error) {
		console.error(`Problème d'accès au dossier : ${directory}`);
		console.error(`Erreur : ${(error as { message: string }).message}`);

		// Tente de créer le dossier avec les permissions appropriées
		try {
			fs.mkdirSync(directory, { recursive: true, mode: 0o755 });
			console.log(`Dossier créé : ${directory}`);
		} catch (mkdirError) {
			console.error(
				`Impossible de créer le dossier : ${(mkdirError as { message: string }).message}`,
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
