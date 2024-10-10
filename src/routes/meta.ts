import { Request, Response } from 'express';
import { prismaClient } from '../config/db';

export const meta = async (req: Request, res: Response) => {
  const theme = req.session.Theme;

  const urls = await prismaClient.url.findMany({
    orderBy: {
      visit: 'desc',
    },
    take: 10,
  });

  res.render('marketPlace', {
    urls,
    auth:
      typeof req.session.Auth !== 'undefined'
        ? req.session.Auth.authenticated
        : undefined,
    theme: theme,
  });
};
