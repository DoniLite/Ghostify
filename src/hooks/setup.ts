import { prismaClient } from '../config/db';
import { encrypt } from '../utils';

export const setUp = async (
  secret: Buffer,
  iv: Buffer,
  generator?: (payload: string) => string
) => {
  const login = process.env.ADMIN_LOGIN;
  const password = encrypt(process.env.ADMIN_PASSWORD, secret, iv);

  const verifyIfadminPresent = await prismaClient.admin.findUnique({
    where: {
      login: login,
    },
  });
  if (!verifyIfadminPresent) {
    console.log('setting up...');
    await prismaClient.admin.create({
      data: {
        role: 'admin',
        login: login,
        password: encrypt(password, secret, iv),
        token: generator(process.env.ADMIN_LOGIN),
      },
    });
    return;
  }
  if (verifyIfadminPresent.password !== password) {
    console.log('Updating...');
    await prismaClient.admin.update({
      where: {
        login: login,
      },
      data: {
        password: password,
      },
    });
    return;
  }
  console.log("it's looks like evrything is OK");
};
