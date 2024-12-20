import { Request, Response } from 'express';
import { prismaClient } from '../config/db';
import { getTimeElapsed, orderReactions, Reactions } from '../utils';
import {} from 'date-fns';

export const meta = async (req: Request, res: Response) => {
  const theme = req.session.Theme;

  const mostPopularActues = await prismaClient.comment.findMany({
    where: {
      isAnActu: true,
    },
  });

  const actues = await Promise.all(
    mostPopularActues
      .map(async (popular) => {
        const relativeComments = await prismaClient.comment.findMany({
          where: {
            commentId: popular.id,
          },
        });
        const replies = await Promise.all(relativeComments.map(async(eachComment) => {
          const thisCommentAuthor = await prismaClient.user.findUnique({
            where: {
              id: eachComment.userId,
            },
            select: {
              file: true,
              username: true,
              fullname: true,
            }
          });
          const thisCommentRelativeEls = await prismaClient.comment.count({
            where: {
              commentId: eachComment.id,
            },
          });
          return {
            ...eachComment,
            userIcon: thisCommentAuthor.file,
            author: thisCommentAuthor.username || thisCommentAuthor.fullname,
            reactionsEls: orderReactions(eachComment.reactions as Reactions[]),
            reactionsLength: eachComment.reactions.length,
            commentsLength: thisCommentRelativeEls
          }
        }))
        const authorInfo = await prismaClient.user.findUnique({
          where: {
            id: popular.userId,
          },
          select: {
            username: true,
            file: true,
            fullname: true,
          },
        })
        return {
          ...popular,
          reactionsEls: orderReactions(popular.reactions as Reactions[]),
          reactionsLength: popular.reactions.length,
          commentsLength: relativeComments.length,
          time: getTimeElapsed(popular.createdAt),
          author: authorInfo.username || authorInfo.fullname,
          userIcon: authorInfo.file,
          replies,
        };
      })
  );
  console.log(actues);

  res.render('marketPlace', {
    auth:
      typeof req.session.Auth !== 'undefined'
        ? req.session.Auth.authenticated
        : undefined,
    theme: theme,
    userId: req.session.Auth.id,
    userIcon: req.session.Auth.file,
    actues
  });
};
