import { Request, Response } from 'express';
import { prismaClient } from '../config/db';
import { Comment } from '@prisma/client';
import { getTimeElapsed, orderReactions, Reactions } from '../utils';
import {} from 'date-fns';

export const meta = async (req: Request, res: Response) => {
  const theme = req.session.Theme;

  const mostPopularActues = await prismaClient.comment.findMany({
    where: {
      isAnActu: true,
    },
  });
  type FrontActues = {
    reactionsEls: string[];
    reactionsLength: number;
    commentsLength: number;
    time: string;
  }[] &
    Comment[];

  const actus = await Promise.all(
    mostPopularActues
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
          time: getTimeElapsed(popular.createdAt),
        };
      })
  );
  console.log(actus);

  res.render('marketPlace', {
    auth:
      typeof req.session.Auth !== 'undefined'
        ? req.session.Auth.authenticated
        : undefined,
    theme: theme,
  });
};
