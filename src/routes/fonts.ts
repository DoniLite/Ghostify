// @ts-types="@types/express"
import { Request, Response } from 'express';
import path from 'node:path';
import process from "node:process";

export const webfont = (req: Request, res: Response) => {
  const WEBFONT_DIR = path.resolve(process.cwd(), './webfonts');
  const { file } = req.params;
  const resourcePath = path.join(WEBFONT_DIR, file);
  res.status(200).sendFile(resourcePath);
};
