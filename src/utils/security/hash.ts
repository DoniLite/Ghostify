import { Buffer } from 'node:buffer';
import bcrypt from 'bcrypt';

export const hashSomething = async (
  data: string | Buffer,
  saltRound?: number,
) => {
  const round = saltRound || 14;
  const salt = await bcrypt.genSalt(round);
  return await bcrypt.hash(data, salt);
};

export const compareHash = async (data: string | Buffer, hash: string) => {
  return await bcrypt.compare(data, hash);
};
