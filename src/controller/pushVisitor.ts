import { Request, Response } from 'express';
import { QueryXData } from '../@types';
import { prismaClient } from '../config/db';

export const urlVisitor = async (req: Request, res: Response) => {
  const { url } = req.query as unknown as QueryXData;
  try {
    const urlUpdate = await prismaClient.url.update({
      where: {
        id: Number(url),
      },
      data: {
        visit: {
          increment: 1,
        },
      },
    });
    res.send(JSON.stringify({ success: true, update: urlUpdate.updatedAt }));
  } catch (err) {
    console.error(err);
    res.status(400).send(JSON.stringify({ error: 'Error updating' }));
  }
};
