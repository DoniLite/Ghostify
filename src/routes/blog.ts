// @ts-types="@types/express"
import { RequestHandler } from 'express';
import { prismaClient } from '../config/db.ts';
import { Post } from '../@types/index.d.ts';

export const blog: RequestHandler = async (req, res) => {
  const Theme = req.session.Theme;
  const verifQuota = 300;

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
  res.render('blog', {
    auth: typeof req.session.Auth !== 'undefined'
      ? req.session.Auth.authenticated
      : undefined,
    categories: [...categories.map((category) => category.title)],
    defaultArticles: articlesResults.defaultArticles,
    topArticles: articlesResults.topArticles,
    theme: Theme,
  });
};
