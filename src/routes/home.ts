import { encrypt } from '../utils';
import { prismaClient } from '../config/db';
import { RouteHandlerMethod } from 'fastify';
import { Post, QueryXData } from 'index';

export const home: RouteHandlerMethod = async (req, res) => {
  // const value = await client.hGetAll("Weather");
  // const quote = await client.hGetAll("Quote");
  // console.log(value);
  // const connection_time = req.cookies["connection_time"]
  // if (!connection_time || Number(decrypt(req.session.Token, req.session.ServerKeys.secretKey, req.session.ServerKeys.iv)) < Date.now()) {
  //   return res.redirect('/');
  // }
  const { persisted, noApiData, pagination } = req.query as QueryXData<{
    persisted: boolean;
    noApiData: boolean;
    pagination: string;
  }>;
  const verifQuota = 300;
  // const loaderCookie = req.cookies['ghostify_home_session'];
  const Theme = req.session.Theme;
  if (persisted) {
    const urls = await prismaClient.url.findMany({
      orderBy: {
        visit: 'desc',
      },
      take: 10,
    });
    const posts = await prismaClient.post.findMany({
      where: {
        safe: true,
        published: true,
      },
      take: 50,
    });
    const articlesResults = {} as {
      topArticles: Post[];
      defaultArticles: Post[];
    };
    articlesResults.topArticles = [
      ...posts.filter((post) => {
        return post.visites > verifQuota;
      }),
    ];
    articlesResults.defaultArticles = [...posts];
    const categories = await prismaClient.category.findMany();
    const projects = await prismaClient.project.findMany();
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    req.session.Token = encrypt(
      Date.now().toString(),
      req.session.ServerKeys.secretKey,
      req.session.ServerKeys.iv
    );
    res.setCookie('connection_time', req.session.Token, {
      expires: cookieExpriration,
    });
    return res.view('/src/views/index.ejs', {
      activeIndex: pagination ? Number(pagination) : 0,
      projects,
      defaultArticles: articlesResults.defaultArticles,
      topArticles: articlesResults.topArticles,
      urls,
      auth: typeof req.session.Auth !== 'undefined' ? req.session.Auth.authenticated : undefined,
      categories: [...categories.map(category => category.title)],
      theme: Theme,
    });
  }

  const categories = await prismaClient.category.findMany();
  const posts = await prismaClient.post.findMany({
    where: {
      safe: true,
      published: true,
    },
    take: 50,
  });
  const articlesResults = {} as {
    topArticles: Post[];
    defaultArticles: Post[];
  };
  articlesResults.topArticles = [
    ...posts.filter((post) => {
      return post.visites > verifQuota;
    }),
  ];
  articlesResults.defaultArticles = [...posts];
  const urls = await prismaClient.url.findMany({
    orderBy: {
      visit: 'desc',
    },
    take: 10,
  });
  const projects = await prismaClient.project.findMany();
  const cookieObj = {
    pagination: 1,
  };
  const cookieExpiration = new Date();
  cookieExpiration.setMinutes(cookieExpiration.getMinutes() + 15);
  const cookie = JSON.stringify(cookieObj);
  res.setCookie('ghostify_home_session', cookie, { expires: cookieExpiration });
  if (noApiData) {
    return res.view('/src/views/index.ejs', {
      activeIndex: pagination ? Number(pagination) : 0,
      projects,
      defaultArticles: articlesResults.defaultArticles,
      topArticles: articlesResults.topArticles,
      categories: [...categories.map((category) => category.title)],
      auth:
        typeof req.session.Auth !== 'undefined'
          ? req.session.Auth.authenticated
          : undefined,
      urls,
      theme: Theme,
    });
  }
  return res.view('/src/views/index.ejs', {
    activeIndex: pagination ? Number(pagination) : 0,
    projects,
    defaultArticles: articlesResults.defaultArticles,
    topArticles: articlesResults.topArticles,
    categories: [...categories.map((category) => category.title)],
    auth:
      typeof req.session.Auth !== 'undefined'
        ? req.session.Auth.authenticated
        : undefined,
    urls,
    theme: Theme,
  });
};
