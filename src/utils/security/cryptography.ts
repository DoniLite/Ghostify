// import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';

// const server_uid = Bun.env.SECRET_UID;

// interface Keys {
// 	secretKey: string;
// 	iv: string;
// }

export const generateKeys = () => {
	const secretKey: Buffer = crypto.randomBytes(32);
	const iv: Buffer = crypto.randomBytes(16);
	return {
		secretKey: secretKey.toString('hex'),
		iv: iv.toString('hex'),
	};
};
// export async function saveKeys(): Promise<{
// 	secretKey: Buffer;
// 	iv: Buffer;
// }> {
// 	const keys: Keys = generateKeys();

// 	const verifyIfKeyExist = await prismaClient.key.findUnique({
// 		where: {
// 			uid: server_uid,
// 		},
// 	});

// 	if (verifyIfKeyExist && verifyIfKeyExist.key && verifyIfKeyExist.iv) {
// 		return {
// 			secretKey: Buffer.from(verifyIfKeyExist.key, 'hex'),
// 			iv: Buffer.from(verifyIfKeyExist.iv, 'hex'),
// 		};
// 	}

// 	const newKey = await prismaClient.key.create({
// 		data: {
// 			key: keys.secretKey,
// 			iv: keys.iv,
// 			uid: server_uid,
// 			type: 'SessionKey',
// 		},
// 	});
// 	console.log('keys generated and save with success !');
// 	return {
// 		secretKey: Buffer.from(newKey.key!, 'hex'),
// 		iv: Buffer.from(newKey.iv!, 'hex'),
// 	};
// }

// export async function loadKeys(): Promise<{ secretKey: Buffer; iv: Buffer }> {
// 	const keys = await prismaClient.key.findUnique({
// 		where: {
// 			uid: server_uid,
// 		},
// 	});
// 	if (!keys || !keys.key || !keys.iv) {
// 		return await saveKeys();
// 	}

// 	return {
// 		secretKey: Buffer.from(keys.key, 'hex'),
// 		iv: Buffer.from(keys.iv, 'hex'),
// 	};
// }

export function encrypt(text: string, secretKey: Buffer, iv: Buffer): string {
	const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
	let encrypted: string = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return encrypted;
}

export function decrypt(
	encryptedText: string,
	secretKey: Buffer,
	iv: Buffer,
): string {
	const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
	let decrypted: string = decipher.update(encryptedText, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}
