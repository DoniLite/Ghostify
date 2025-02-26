// @ts-types="@types/express"
import { Request, Response } from 'express';
// @ts-types="@types/jsonwebtoken"
import jwt from 'jsonwebtoken';
import path from 'node:path';
import process from "node:process";

export const serveStatic = (req: Request, res: Response) => {
  const { file } = req.params;
  const resourceDir = path.resolve(process.cwd(), '/static');
  try {
    const rPath = jwt.verify(file, process.env.JWT_SECRET!);
    if (typeof rPath === 'string') {
      const resourcePath = path.join(resourceDir, rPath);
      res.status(200).sendFile(resourcePath);
      return;
    }
    res.status(404).send('Invalid credentials');
    return;
  } catch (err) {
    console.error(err);
    res.status(404).send('cannot access to this resource');
  }
};

export const downloader =  (req: Request, res: Response) => {
  const { file } = req.params;
  const resourceDir = path.resolve(process.cwd(), '/static');
  try {
    const rPath = jwt.verify(file, process.env.JWT_SECRET!);
    if (typeof rPath === 'string') {
      const resourcePath = path.join(resourceDir, rPath);
      res.status(200).download(resourcePath);
      return;
    }
    res.status(404).send('Invalid credentials');
    return;
  } catch (err) {
    console.error(err);
    res.status(404).send('cannot access to this resource');
  }
};
