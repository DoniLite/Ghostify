import { Request, Response } from 'express';
import { BodyXData } from '../@types';
import { prismaClient } from '../config/db';
import crypto from 'node:crypto';

interface Assets {
  type: 'Component' | 'Script' | 'Page' | 'Snippet';
  content: string;
  title: string;
  uid: string | undefined;
}

export const assetPoster = async (req: Request, res: Response) => {
  const { title, type, content, uid } = req.body as BodyXData<Assets>;
  const newAsset = await prismaClient.assets.create({
    data: {
      title: title,
      type: type,
      content: content,
      uid:
        typeof uid === 'undefined'
          ? crypto.randomBytes(80).toString('hex')
          : uid,
    },
  });
  res.send(JSON.stringify({ assetLink: `/asset?ref=${newAsset.uid}` }));
};
