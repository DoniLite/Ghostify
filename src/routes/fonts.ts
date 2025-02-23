// @ts-types="@types/express"
import { Request, Response } from 'express';
import path from 'node:path';

export const webfont = (req: Request, res: Response) => {
  const WEBFONT_DIR = path.resolve(__dirname, '../../webfonts');
  const { file } = req.params;
  const resourcePath = path.join(WEBFONT_DIR, file);
  res.status(200).sendFile(resourcePath);
};
