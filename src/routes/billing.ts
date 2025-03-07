// @ts-types="@types/express"
import { Request, Response } from 'express';

export const billing = (_req: Request, res: Response) => {
  res.render('billing', { service: 'billing' });
};
