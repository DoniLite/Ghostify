import { Buffer } from 'node:buffer';
import { prismaClient } from '../../config/db.ts';
import crypto from 'node:crypto';

const server_uid = Deno.env.get('SECRET_UID');

interface Keys {
  secretKey: string;
  iv: string;
}

export const generateKeys = () => {
  const secretKey: Buffer = crypto.randomBytes(32);
  const iv: Buffer = crypto.randomBytes(16);
  return {
    secretKey: secretKey.toString('hex'),
    iv: iv.toString('hex'),
  };
};
// Fonction pour générer et sauvegarder les clés
export async function saveKeys(): Promise<{
  secretKey: Buffer;
  iv: Buffer;
}> {
  const keys: Keys = generateKeys();

  const verifyIfKeyExist = await prismaClient.key.findUnique({
    where: {
      uid: server_uid,
    },
  });

  if (verifyIfKeyExist && verifyIfKeyExist.key && verifyIfKeyExist.iv) {
    return {
      secretKey: Buffer.from(verifyIfKeyExist.key, 'hex'),
      iv: Buffer.from(verifyIfKeyExist.iv, 'hex'),
    };
  }

  const newKey = await prismaClient.key.create({
    data: {
      key: keys.secretKey,
      iv: keys.iv,
      uid: server_uid,
      type: 'SessionKey',
    },
  });
  console.log('Clés générées et sauvegardées avec succès !');
  return {
    secretKey: Buffer.from(newKey.key!, 'hex'),
    iv: Buffer.from(newKey.iv!, 'hex'),
  };
}

// Fonction pour charger les clés depuis le fichier
export async function loadKeys(): Promise<{ secretKey: Buffer; iv: Buffer }> {
  const keys = await prismaClient.key.findUnique({
    where: {
      uid: server_uid,
    },
  });
  if (!keys || !keys.key || !keys.iv) {
    return await saveKeys();
  }

  return {
    secretKey: Buffer.from(keys.key, 'hex'),
    iv: Buffer.from(keys.iv, 'hex'),
  };
}

// Fonction pour chiffrer les données
export function encrypt(text: string, secretKey: Buffer, iv: Buffer): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted: string = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Fonction pour déchiffrer les données
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
