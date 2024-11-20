import {
  colors,
  generateAndSaveKeys,
  graphicsUploader,
  loadKeys,
} from '../utils';
import { randomInt } from 'node:crypto';
import fs from 'node:fs'
import path from 'node:path';
import { NextFunction, Request, Response } from 'express';

export const sessionStorageHook = async (req: Request, res: Response, next: NextFunction ) => {
  const allDirsFiles = fs.readdirSync(path.resolve(__dirname, '../../src//public/img')).filter(file => /random/.test(file));
  // console.log('fichiers trouvés :', allDirsFiles);
  const randomNumber = randomInt(1, allDirsFiles.length);
  const footerImg = `/static/img/${allDirsFiles[randomNumber]}`;
  req.session.Theme = {
    background: graphicsUploader(),
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

  if(!req.session.Services) {
    req.session.Services = {
      Platform: {
        internals: true,
        API: true,
      }
    }
  }
  next();
  // req.setSession = async (payload: any, dest: 'Weather'|'Quote' ) => {
  //     if (dest === 'Weather') {
  //         req.session.Weather = payload;
  //     }
  //     if (dest === 'Quote') {
  //         req.session.Quote = payload;
  //     }
  // }
};
