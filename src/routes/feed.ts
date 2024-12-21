import { Request, Response } from 'express';
import { BodyXData } from 'index';
import { prismaClient } from '../config/db';

export const feed = async (req: Request, res: Response) => {
  const { id } = req.params;
  let tryParse;
  try {
    tryParse = Number(id);
  } catch (e) {
    console.error(e);
    tryParse = id;
  }

  const comment =
    typeof tryParse === 'number'
      ? await prismaClient.comment.findUnique({ where: { id: tryParse } })
      : await prismaClient.comment.findUnique({ where: { token: tryParse } });
  res.json(comment);
};

export const reactions = async (req: Request, res: Response) => {
  const {
    pointer,
    pointerId,
    reactionType,
  } = req.body as BodyXData<{
    pointer: string | undefined;
    pointerId: string | undefined;
    reactionType: 'Like' | 'Good' | 'Hurted' | 'Love';
  }>;

  if(!pointer || !pointerId || !reactionType) {
    res.status(400).send('Bad request');
    return;
  }
};
