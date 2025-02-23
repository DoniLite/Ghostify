import { prismaClient } from '../config/db.ts';
import {
  compareHash,
  conditionsMD,
  FAQMD,
  hashSomething,
  privacyMD,
  termsMD,
  unify,
} from '../utils.ts';
import process from "node:process";

const SETUP_ASSETS = Boolean(process.env.SETUP_ASSETS);
const uids = [
  'terms',
  'conditions',
  'policy',
  'FAQ',
] as const;

export const setUp = async (
  generator?: (payload: string) => string,
) => {
  const login = process.env.ADMIN_LOGIN!;
  const password = await hashSomething(process.env.ADMIN_PASSWORD);

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
    let htmlString;
    if (uids[i] === 'FAQ') {
      htmlString = await unify(FAQMD);
    }
    if (uids[i] === 'conditions') {
      htmlString = await unify(conditionsMD);
    }
    if (uids[i] === 'policy') {
      htmlString = await unify(privacyMD);
    }
    if (uids[i] === 'terms') {
      htmlString = await unify(termsMD);
    }
    if (!el) {
      await prismaClient.assets.create({
        data: {
          type: 'Page',
          uid: uids[i],
          title: `Ghostify | ${uids[i]}`,
          content: htmlString,
        },
      });
    }
    if (SETUP_ASSETS) {
      await prismaClient.assets.update({
        where: {
          uid: uids[i],
        },
        data: {
          content: htmlString,
        },
      });
    }
  });

  const verifyIfadminPresent = await prismaClient.admin.findUnique({
    where: {
      login: login,
    },
  });
  if (!verifyIfadminPresent && generator) {
    console.log('setting up...');
    await prismaClient.admin.create({
      data: {
        role: 'admin',
        login: login,
        password: password,
        token: generator(process.env.ADMIN_LOGIN!),
      },
    });
    return;
  }
  const compareResult = await compareHash(
    password,
    verifyIfadminPresent!.password,
  );
  if (compareResult) {
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
