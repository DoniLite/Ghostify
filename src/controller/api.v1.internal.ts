import { Request, Response } from 'express';
import { QueryXData } from 'index';
import { tokenGenerator } from '../server';
import path from 'node:path';
import fs from 'node:fs';
import { prismaClient } from '../config/db';
import {randomInt} from 'node:crypto'

export const internDocCreator = async (req: Request, res: Response) => {
  const { userName, filePath, docType } = req.query as QueryXData<{
    userName: string;
    filePath: string;
    docType: string;
  }>;

  const STATIC_DIR = path.resolve(__dirname, '../../static');
  const DOCUMENT_DIR = path.join(STATIC_DIR, 'downloads/doc');

  try {
    const date = new Date();
    const user = await prismaClient.user.findUnique({
      where: {
        username: userName
      }, 
      select: {
        id: true
      }
    })
    const doc =
      typeof docType === 'undefined'
        ? date.getTime().toString()
        : date.getTime().toString() + docType;
    const docServicePath =
      process.env.NODE_ENV === 'production'
        ? 'https://ghostify.site/downloader/' +
          tokenGenerator(`downloads/doc/${doc}`)
        : 'http://localhost:3085/downloader/' +
          tokenGenerator(`downloads/doc/${doc}`);
    fs.renameSync(filePath, path.join(DOCUMENT_DIR, doc)) 
    const newDoc = await prismaClient.document.create({
      data: {
        uid: tokenGenerator((date.getTime() + randomInt(1000)).toString()),
        type: docType || 'doc',
        userId: user.id,
        downloadLink: docServicePath,
      },
    });
    res.json({success: true, link: newDoc.downloadLink});
    return;
  } catch (e) {
    res.status(400).send('Invalid user ID');
    return;
  }
};


interface TokenClaimModel {
  id: number;
  token: string;
  registration: string;
  apiCredits: string;
  cvCredits: string;
  posterCredits: string;
}