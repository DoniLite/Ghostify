import { NextFunction, Request, Response } from 'express';
import { decrypt, encrypt } from '../utils';

const OPEN_ROUTES = ['/home'];
const AUTH_ROUTES = [
  '/poster/docs',
  '/poster/parser',
  '/poster/view',
  '/cvMaker',
  '/poster/new',
  '/service',
  '/poster/update/:post',
  '/poster/load/:uid',
];

export const ROUTES = [
  ...OPEN_ROUTES,
  ...AUTH_ROUTES,
];

const isOpenRoute = (url: string) => 
  OPEN_ROUTES.some(route => url.includes(route));

const isAuthRoute = (url: string) => 
  AUTH_ROUTES.some(route => url.includes(route));

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { cookies } = req;
  const lastTime = cookies['connection_time'];

  const redirectToSignIn = () => 
    res.redirect('/signin?service=poster');

  try {
    // Vérification du temps de connexion
    if (
      typeof lastTime === 'string' &&
      Date.now() > Number(
        decrypt(
          lastTime,
          req.session.ServerKeys.secretKey,
          req.session.ServerKeys.iv
        )
      )
    ) {
      req.session.Auth = { authenticated: false };
      req.session.RedirectUrl = req.baseUrl;
      console.log(req.session.RedirectUrl);
      return isOpenRoute(req.baseUrl) ? next() : redirectToSignIn();
    }

    // Vérification de l'authentification
    if (!req.session.Auth || req.session.Auth.authenticated === false) {
      req.session.RedirectUrl = req.baseUrl;
      return isOpenRoute(req.baseUrl) ? next() : redirectToSignIn();
    }

    // Renouvellement du token
    const cookieExpiration = new Date();
    cookieExpiration.setMinutes(cookieExpiration.getMinutes() + 15);

    req.session.Token = encrypt(
      cookieExpiration.getTime().toString(),
      req.session.ServerKeys.secretKey,
      req.session.ServerKeys.iv
    );

    res.cookie('connection_time', req.session.Token, {
      expires: cookieExpiration,
    });

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    req.session.RedirectUrl = req.baseUrl;
    console.log(req.session.RedirectUrl);
    return isOpenRoute(req.baseUrl) ? next() : redirectToSignIn();
  }
};