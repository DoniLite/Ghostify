import { FastifyRequest } from 'fastify';
import {
  colors,
  generateAndSaveKeys,
  graphicsUploader,
  loadKeys,
} from '../utils';
import { randomInt } from 'node:crypto';

export const sessionStorageHook = async (req: FastifyRequest) => {
  const randomNumber = randomInt(1, 9);
  const footerImg = `/static/img/random${randomNumber}.png`;
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

  if (!req.session.Auth ) {
    req.session.Auth = {
      authenticated: false,
    };
  }
  // req.setSession = async (payload: any, dest: 'Weather'|'Quote' ) => {
  //     if (dest === 'Weather') {
  //         req.session.Weather = payload;
  //     }
  //     if (dest === 'Quote') {
  //         req.session.Quote = payload;
  //     }
  // }
};
