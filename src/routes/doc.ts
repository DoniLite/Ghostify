// @ts-types="@types/express"
import { Request, Response } from 'express';

export const documentView = async (_req: Request, res: Response) => {
  res.render('documentInput', {
    service: 'poster',
  });
};
