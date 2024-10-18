import { Request, Response } from 'express';
import { prismaClient } from '../config/db';
import { Comment } from '@prisma/client';
import { orderReactions, Reactions } from '../utils';

export const meta = async (req: Request, res: Response) => {
  const theme = req.session.Theme;

  const urls = await prismaClient.url.findMany({
    orderBy: {
      visit: 'desc',
    },
    take: 10,
  });
  const promotions = await prismaClient.promotion.findMany({
    select: { file: true, link: true },
    orderBy: {
      createdAt: 'asc',
    },
    take: 4,
  });

  const mostPopularActues = await prismaClient.comment.findMany({
    where: {
      isAnActu: true,
    },
  });
  type FrontActues = {
    reactionsEls: string[];
    reactionsLength: number;
    commentsLength: number;
  }[] &
    Comment[];
  const actus: {
    popular: FrontActues;
    rest: FrontActues;
  } = {
    popular: [],
    rest: [],
  };

  actus.popular = await Promise.all(
    mostPopularActues
      .filter((actu) => actu.reactions.length > 100)
      .map(async (popular) => {
        const commentsLength = await prismaClient.comment.count({
          where: {
            commentId: popular.id,
          },
        });
        return {
          ...popular,
          reactionsEls: orderReactions(popular.reactions as Reactions[]),
          reactionsLength: popular.reactions.length,
          commentsLength: commentsLength,
        };
      })
  );
  actus.rest = await Promise.all([...mostPopularActues].map(async (actu) => {
    const commentsLenght = await prismaClient.comment.count({
      where: {
        commentId: actu.id,
      }
    });
    return {
      ...actu,
      reactionsEls: orderReactions(actu.reactions as Reactions[]),
      reactionsLength: actu.reactions.length,
      commentsLength: commentsLenght,
    }
  }));

  console.log(actus);

  res.render('marketPlace', {
    popularActues: actus.popular,
    restActues: actus.rest,
    promotions,
    urls,
    auth:
      typeof req.session.Auth !== 'undefined'
        ? req.session.Auth.authenticated
        : undefined,
    theme: theme,
  });
};
