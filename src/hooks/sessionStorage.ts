import { FastifyRequest } from 'fastify';
import {
  colors,
  generateAndSaveKeys,
  graphicsUploader,
  loadKeys,
} from '../utils';
import { randomInt } from 'node:crypto';
import { prismaClient } from '../config/db';

export const sessionStorageHook = async (
  req: FastifyRequest,
) => {
  const randomNumber = randomInt(1, 9);
  const des = Math.random();
  const actus = await prismaClient.actu.findMany({select: {file: true}});
  const filesNumber = actus.length;
  const actuFile = randomInt(filesNumber + 1);
  let footerImg
  if (des === 1) {
    footerImg = `/static/img/random${randomNumber}.png`;
  } else {
    footerImg = actus.length <= 0 ? `/static/img/random${randomNumber}.png` : actus[actuFile].file
  }
  req.session.Theme = {
    time: graphicsUploader(),
    footer: footerImg,
    ...colors,
  };
  const keys = await loadKeys();
  if (!keys) {
    await generateAndSaveKeys();
    req.session.ServerKeys = await loadKeys();
  }
  req.session.ServerKeys = keys;
  // req.setSession = async (payload: any, dest: 'Weather'|'Quote' ) => {
  //     if (dest === 'Weather') {
  //         req.session.Weather = payload;
  //     }
  //     if (dest === 'Quote') {
  //         req.session.Quote = payload;
  //     }
  // }
};
