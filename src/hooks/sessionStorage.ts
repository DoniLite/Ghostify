import {
  colors,
  generateAndSaveKeys,
  graphicsUploader,
  loadKeys,
} from '../utils.ts';
import { randomInt } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from "node:process";
import { factory } from '../factory.ts';


const sessionMiddleware = factory.createMiddleware(async (c, next) => {
  const allDirsFiles = fs
    .readdirSync(path.resolve(process.cwd(), './static/img'))
    .filter((file) => /random/.test(file));
  // console.log('fichiers trouvés :', allDirsFiles);
  const randomNumber = randomInt(1, allDirsFiles.length);
  const footerImg = `/static/img/${allDirsFiles[randomNumber]}`;
  const session = c.get('session');
  session.set('Theme', {
    background: graphicsUploader(),
    footer: footerImg,
    ...colors,
  });
  const keys = await loadKeys();
  if (!keys) {
    await generateAndSaveKeys();
    session.set('ServerKeys', await loadKeys());
  }
  session.set('ServerKeys', keys);
  if(!session.get('Auth')) {
    session.set('Auth', {
      authenticated: false,
    });
  }
  if(!session.get('Services')) {
    session.set('Services', {
      Platform: {
        internals: true,
        API: true,
      },
    });
  }
  session.set('RedirectUrl', '/home');
  await next();
})

export default sessionMiddleware;
