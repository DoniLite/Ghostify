import { password } from 'bun'
import { Buffer } from 'node:buffer'

export const hashSomething = async (data: string | Buffer) => {
  return await password.hash(data, 'bcrypt')
}

export const compareHash = async (data: string | Buffer, hash: string) => {
  return await password.verify(data, hash, 'bcrypt')
}
