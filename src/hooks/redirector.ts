// @ts-types="@types/express"
import { NextFunction, Request, Response } from 'express';
import { encrypt } from '../utils.ts';
import { QueryXData } from '../@types/index.d.ts';

const matchedRoutes = [
  '',
  '/',
];

export const redirector = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method !== 'GET') {
    next();
    return;
  }
  if (!matchedRoutes.includes(req.url)) {
    next();
    return;
  }
  const loaderCookie = req.cookies['ghostify_home_session'];
  if (!loaderCookie) {
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    req.session.Token = encrypt(
      Date.now().toString(),
      req.session?.ServerKeys?.secretKey,
      req.session?.ServerKeys?.iv,
    );
    res.cookie('connection_time', req.session.Token, {
      expires: cookieExpriration,
    });
    res.render('loader', {
      pagination: 0,
      activeIndex: 0,
    });
    return;
  }
  const { persisted, noApiData } = req.query as unknown as QueryXData<{
    persisted: boolean | undefined;
    noApiData: boolean | undefined;
  }>;
  req.session.Persisted = persisted;
  req.session.NoAPIsData = noApiData;
  const cookieObj = JSON.parse(loaderCookie) as Record<string, unknown>;
  req.session.Cookies = {
    ...req.session.Cookies,
    ...cookieObj,
  };
  if (req.url === '/' || req.url === '') {
    res.redirect('/home');
    return;
  }
  next();
};
