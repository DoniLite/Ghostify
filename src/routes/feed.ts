// @ts-types="@types/express"
import { Request, Response } from 'express';
import { BodyXData } from '../@types/index.d.ts';
import { prismaClient } from '../config/db.ts';
import { getTimeElapsed, orderReactions, Reactions } from '../utils.ts';
import { logger } from '../logger.ts';

export const feed = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let tryParse;
    try {
      tryParse = Number(id);
    } catch (e) {
      console.error(e);
      tryParse = id;
    }

    if (typeof tryParse !== 'string' && typeof tryParse !== 'number') {
      res.status(400).send('Invalid id');
      return;
    }

    const comment =
      typeof tryParse === 'number'
        ? await prismaClient.comment.findUnique({ where: { id: tryParse } })
        : await prismaClient.comment.findUnique({ where: { token: tryParse } });
    if (!comment) {
      res.status(404).send('Comment not found');
      return;
    }
    const author = await prismaClient.user.findUnique({
      where: {
        id: comment.userId!,
      },
      select: {
        username: true,
        fullname: true,
        file: true,
      },
    });
    const replies = await prismaClient.comment.findMany({
      where: {
        commentId: comment.id,
      },
    });
    const data = {
      ...comment,
      userIcon: author?.file,
      author: author?.username || author?.fullname,
      time: getTimeElapsed(comment.createdAt),
      reactionsLength: comment.reactions.length,
      reactionsEls: orderReactions(comment.reactions as Reactions[]),
      replies: await Promise.all(
        replies.map(async (reply) => {
          return {
            ...reply,
            time: getTimeElapsed(reply.createdAt),
            userIcon: (
              await prismaClient.user.findUnique({
                where: {
                  id: reply.userId!,
                },
                select: {
                  file: true,
                },
              })
            )!.file,
            author:
              (
                await prismaClient.user.findUnique({
                  where: {
                    id: reply.userId!,
                  },
                  select: {
                    username: true,
                  },
                })
              )?.username ||
              (
                await prismaClient.user.findUnique({
                  where: {
                    id: reply.userId!,
                  },
                  select: {
                    fullname: true,
                  },
                })
              )?.fullname,
            commentsLength: await prismaClient.comment.count({
              where: {
                commentId: reply.id,
              },
            }),
            reactionsLength: reply.reactions.length,
          };
        })
      ),
      commentsLength: replies.length,
    };
    res.render('components/feed', {
      comment: data,
      mode: 'view',
      userIcon: req.session?.Auth?.file || undefined,
      auth: req.session?.Auth?.authenticated,
      service: undefined,
    });
  } catch (e) {
    console.error(e);
    logger.error(`Error in feed at ${req.url} ${Date.now().toString()}: ${e}`);
    res.status(500).send('Internal server error');
  }
};

export const reactions = async (req: Request, res: Response) => {
  const { pointer, pointerId, reactionType } = req.body as BodyXData<{
    pointer: string | undefined;
    pointerId: string | undefined;
    reactionType: 'Love' | 'Laugh' | 'Hurted' | 'Good';
  }>;

  if (!pointer || !pointerId || !reactionType) {
    res.status(400).send('Bad request');
    return;
  }

  try {
    const id = Number(pointerId);
    await prismaClient.comment.update({
      where: {
        id,
      },
      data: {
        reactions: {
          push: reactionType,
        },
      },
    });
    res.status(200).send('Reaction added');
  } catch (error) {
    console.error(error);
    logger.error(
      `Error in feed at ${req.url} ${Date.now().toString()}: ${error}`
    );
    res.status(500).send('Internal server error');
  }
};
