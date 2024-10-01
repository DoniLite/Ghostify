import { Request, Response } from 'express';

export const cv = async (req: Request, res: Response) => {
  res.render('components/cvForm', { service: undefined });
};
