// @ts-types="@types/express"
import { type Request, type Response } from 'express';
import { type QueryXData } from '../@types/index.d.ts';
import { tokenGenerator } from '../server.ts';
import path from 'node:path';
import fs from 'node:fs';
import { prismaClient } from '../config/db.ts';
import { randomInt } from 'node:crypto';
import { loadSecurityBearer, verifySecurity } from '../utils.ts';
import { logger } from '../logger.ts';
import process from "node:process";

const API_PORT = process.env.NODE_ENV === 'production' ? 8080 : 8000;


export const internDocCreator = async (req: Request, res: Response) => {
  const { userId, filePath, docType } = req.query as QueryXData<{
    userId: string;
    filePath: string;
    docType: string;
  }>;

  const STATIC_DIR = path.resolve(__dirname, '../../static');
  const DOCUMENT_DIR = path.join(STATIC_DIR, 'downloads/doc');

  try {
    const date = new Date();
    const user = await prismaClient.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
      },
    });
    const doc = typeof docType === 'undefined'
      ? date.getTime().toString()
      : date.getTime().toString() + docType;
    const docServicePath = process.env.NODE_ENV === 'production'
      ? 'https://ghostify.site/downloader/' +
        tokenGenerator(`downloads/doc/${doc}`)
      : 'http://localhost:3085/downloader/' +
        tokenGenerator(`downloads/doc/${doc}`);
    fs.renameSync(filePath, path.join(DOCUMENT_DIR, doc));
    const newDoc = await prismaClient.document.create({
      data: {
        uid: tokenGenerator((date.getTime() + randomInt(1000)).toString()),
        type: docType || 'doc',
        userId: user?.id,
        downloadLink: docServicePath,
      },
    });
    res.json({ success: true, link: newDoc.downloadLink });
    return;
  } catch (e) {
    res.status(400).send('Invalid user ID');
    logger.error(
      `error during the creation of the document for the user ${userId}`,
      e,
    );
    return;
  }
};

interface TokenClaimModel {
  id: number;
  token: string;
  registration: Date;
  apiCredits: number;
  cvCredits: number;
  posterCredits: number;
}

interface ApiToken {
  access_token: string;
  token_type: string;
}

export const internalTokenGenerator = async (req: Request, res: Response) => {
  const { Auth } = req.session;

  if (!Auth!.authenticated) {
    res.status(403).json({ message: 'not authenticated' });
    return;
  }

  try {
    const user = (await prismaClient.user.findUnique({
      where: {
        id: Auth!.id,
        apiAccess: true,
      },
      select: {
        id: true,
        token: true,
        registration: true,
        apiCredits: true,
        cvCredits: true,
        posterCredits: true,
      },
    })) as TokenClaimModel;
    if (!user) {
      res.status(403).json({ message: 'not authorized' });
      return;
    }
    const apiLink = `http://localhost:${API_PORT}/api/v1/token`;
    const verifySecurityToken = await verifySecurity();
    if (!verifySecurityToken) {
      res
        .status(500)
        .json({ message: 'Internal server error please try again later' });
      return;
    }
    const bearerToken = await loadSecurityBearer();
    if (!bearerToken) {
      res
        .status(500)
        .json({ message: 'Internal server error please try again later' });
      return;
    }
    const r = await fetch(apiLink, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken.hash}`,
      },
      body: JSON.stringify({
        ...user,
        registration: user.registration.toISOString(),
      }),
    });
    if (!r.ok) {
      res
        .status(r.status)
        .json({ message: 'Internal server error please try again later' });
      return;
    }
    const resContent: ApiToken = await r.json();
    const { token, type } = await prismaClient.key.create({
      data: {
        token: resContent.access_token,
        userId: Auth!.id,
        type: 'ApiKey',
      },
    });
    res.status(200).json({
      token: {
        token,
        type,
      },
    });
    return;
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e });
  }
};

export const internalSubscriptionVerify = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  const user = await prismaClient.user.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      registration: true,
      apiAccess: true,
      apiCredits: true,
      cvCredits: true,
      posterCredits: true,
    },
  });

  const date = new Date(user!.registration!);

  if (
    Date.now() < date.getTime() &&
    user!.apiAccess &&
    user!.apiCredits > 0 &&
    user!.cvCredits > 0 &&
    user!.posterCredits > 0
  ) {
    res.status(200).json({ message: 'subscription not expired' });
    return;
  }
  res.status(400).json({ message: 'subscription expired' });
  return;
};
