import { prismaClient } from '../config/db';
import { conditionsMD, encrypt, FAQMD, privacyMD, termsMD, unify } from '../utils';

const SETUP_ASSETS = Boolean(process.env.SETUP_ASSETS);
const uids = [
  'terms',
  'conditions',
  'policy',
  'FAQ',
] as const 

export const setUp = async (
  secret: Buffer,
  iv: Buffer,
  generator?: (payload: string) => string
) => {
  const login = process.env.ADMIN_LOGIN;
  const password = encrypt(process.env.ADMIN_PASSWORD, secret, iv);

  [
    await prismaClient.assets.findUnique({
      where: {
        uid: 'terms',
      },
    }),

    await prismaClient.assets.findUnique({
      where: {
        uid: 'conditions',
      },
    }),

    await prismaClient.assets.findUnique({
      where: {
        uid: 'policy',
      },
    }),

    await prismaClient.assets.findUnique({
      where: {
        uid: 'FAQ',
      },
    }),
  ].forEach(async (el, i) => {
    let htmlString
    if(uids[i] === 'FAQ') {
      htmlString = await unify(FAQMD);
    }
    if(uids[i] === 'conditions') {
      htmlString = await unify(conditionsMD);
    }
    if(uids[i] === 'policy') {
      htmlString = await unify(privacyMD);
    }
    if(uids[i] === 'terms') {
      htmlString = await unify(termsMD);
    }
    if(!el) {
      await prismaClient.assets.create({
        data: {
          type: 'Page',
          uid: uids[i],
          title: `Ghostify | ${uids[i]}`,
          content: htmlString
        },
      });
    }
    if(SETUP_ASSETS) {
      await prismaClient.assets.update({
        where: {
          uid: uids[i],
        },
        data: {
          content: htmlString,
        }
      });
    }
  });

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
    console.log('All done');
    return;
  }
  console.log("it's looks like evrything is OK");
};
