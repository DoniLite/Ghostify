import { Service } from 'index';
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

  const assets: {
    cvCredits?: number;
    posterCredits?: number;
    apiCredits?: number;
    apiAccess?: boolean;
    registered?: boolean;
    service?: Service;
  } = {};

  const userData = req.session.Auth.authenticated
    ? await prismaClient.user.findUnique({
        where: {
          id: req.session.Auth.id,
        },
      })
    : null;

  if (userData) {
    assets.apiCredits = userData.apiCredits;
    assets.cvCredits = userData.cvCredits;
    assets.posterCredits = userData.posterCredits;
    assets.apiAccess = userData.apiAccess;
    assets.registered = userData.registered;
    assets.service = {
      Platform: req.session.Services.Platform,
    };
  }
  const firstUserPosts =
    req.session.Auth.authenticated && typeof req.session.Auth.id === 'number'
      ? await prismaClient.post.findMany({
          where: {
            userId: req.session.Auth.id,
          },
        })
      : [];

  const userPosts = firstUserPosts.map((post) => {
    return {
      ...post,
      slugs: post.slug ? post.slug.split(',') : [],
    };
  });
  const CVs =
    req.session.Auth.authenticated && typeof req.session.Auth.id === 'number'
      ? await prismaClient.cV.findMany({
          where: {
            userId: req.session.Auth.id,
          },
        })
      : [];
  console.log('user posts: ', userPosts);
  console.log('session object:', req.session.Auth);
  // const loaderCookie = req.cookies['ghostify_home_session'];
  const Theme = req.session.Theme;

  res.render('index', {
    auth:
      typeof req.session.Auth !== 'undefined'
        ? req.session.Auth.authenticated
        : undefined,
    theme: Theme,
    user: req.session.Auth.name || 'setup username 🤖',
    userId: req.session.Auth.id || req.session.Auth.login || '',
    userPosts,
    userFile: req.session.Auth.file || undefined,
    assets,
    bio: userData ? userData.bio : undefined,
    link: userData ? userData.link : undefined,
    CVs,
  });
  return;
};
