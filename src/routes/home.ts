import { prismaClient } from '../config/db';
import { RequestHandler } from 'express';

export const home: RequestHandler = async (req, res) => {
  // const value = await client.hGetAll("Weather");
  // const quote = await client.hGetAll("Quote");
  // console.log(value);
  // const connection_time = req.cookies["connection_time"]
  // if (!connection_time || Number(decrypt(req.session.Token, req.session.ServerKeys.secretKey, req.session.ServerKeys.iv)) < Date.now()) {
  //   return res.redirect('/');
  // }

  const userPosts =
    req.session.Auth.authenticated &&
    typeof req.session.Auth.isSuperUser === 'undefined'
      ? await prismaClient.post.findMany({
          where: {
            userId: req.session.Auth.id,
          },
        })
      : [];
  // const loaderCookie = req.cookies['ghostify_home_session'];
  const Theme = req.session.Theme;

  res.render('index', {
    auth:
      typeof req.session.Auth !== 'undefined'
        ? req.session.Auth.authenticated
        : undefined,
    theme: Theme,
    user: req.session.Auth.name || '@super user 🤖',
    userId: req.session.Auth.id || req.session.Auth.login || '',
    userPosts,
  });
};
