// @ts-types="@types/express"
import { Request, Response } from 'express';

export const documentView = (_req: Request, res: Response) => {
  res.render('documentInput', {
    service: 'poster',
  });
};
