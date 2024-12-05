import { NextFunction, Request, Response } from 'express';
import { decrypt, encrypt } from '../utils';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies;
  const lastTime = cookie['connection_time'];

  try {
    if (
      typeof lastTime === 'string' &&
      Date.now() >
        Number(
          decrypt(
            lastTime,
            req.session.ServerKeys.secretKey,
            req.session.ServerKeys.iv
          )
        )
    ) {
      req.session.Auth = {
        authenticated: false,
      };
      res.redirect('/signin?service=blog');
      return;
    }
    if (!req.session.Auth || req.session.Auth.authenticated === false) {
      res.redirect('/signin?service=blog');
      return;
    }
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    req.session.Token = encrypt(
      cookieExpriration.getTime().toString(),
      req.session.ServerKeys.secretKey,
      req.session.ServerKeys.iv
    );
    res.cookie('connection_time', req.session.Token, {
      expires: cookieExpriration,
    });
    next();
  } catch (e) {
    console.log(e);
    res.redirect('/signin?service=blog');
  }
};

export const targetAuthRoutes = [
  '/poster/docs',
  '/poster/parse',
  '/poster/view',
  '/cvMaker',
  '/poster/new',
  '/service',
  '/poster/update/:post',
  '/poster/load/:uid',
];
