import { Indexer, QueryXData } from 'index';
import { prismaClient } from '../config/db';
import { filterIncludesType } from '../utils';
import { Request, Response } from 'express';

export const find = async (req: Request, res: Response) => {
  const { q } = req.query as QueryXData;
  const allIndexer = (await prismaClient.indexer.findMany()) as Indexer[];
  let allResources = [] as unknown[];
  const result = allIndexer.filter((index) => {
    return index.keys.split(',').includes(q);
  });
  if (result.length <= 0) {
    // y'a problem nigga
    const someThatCanMatch = [
      ...(await prismaClient.url.findMany()),
      ...(await prismaClient.post.findMany()),
      ...(await prismaClient.comment.findMany()),
      ...(await prismaClient.project.findMany()),
      ...(await prismaClient.assets.findMany()),
      ...(await prismaClient.gameData.findMany()),
    ].filter((el) => {
      filterIncludesType(q, el);
    });
    res.send(JSON.stringify({ data: someThatCanMatch }));
  }
  result.forEach(async (key) => {
    const urls = await prismaClient.url.findMany({
      where: {
        indexerId: key.id,
      },
    });
    const posts = await prismaClient.post.findMany({
      where: {
        indexerId: key.id,
      },
    });
    const comments = await prismaClient.comment.findMany({
      where: {
        indexerId: key.id,
      },
    });
    const projecs = await prismaClient.project.findMany({
      where: {
        indexerId: key.id,
      },
    });
    const assets = await prismaClient.assets.findMany({
      where: {
        indexerId: key.id,
      },
    });
    const games = await prismaClient.gameData.findMany({
      where: {
        indexerId: key.id,
      },
    });
    allResources = [
      ...allResources,
      ...urls,
      ...posts,
      ...games,
      ...assets,
      ...comments,
      ...projecs,
    ];
    allResources.sort();
  });
  res.send(JSON.stringify({ data: allResources }));
};

interface KeyQuery {
  keyType: string;
  k: string;
}

export const updateKeys = async (req: Request, res: Response) => {
  const { k, keyType } = req.query as unknown as QueryXData<KeyQuery>;
  try {
    const serverKey = await prismaClient.indexer.findUnique({
      where: {
        type: keyType,
      },
      select: {
        keys: true,
      },
    });
    if (!serverKey) {
      const newKey = await prismaClient.indexer.create({
        data: {
          type: keyType,
          keys: k,
        },
      });
      if (!newKey) {
        res
          .status(500)
          .send(
            JSON.stringify({
              message: 'Error during your current running operation',
            })
          );
      }
      res.send(
        JSON.stringify({
          message: 'The new indexer have been created successfully',
          data: newKey,
        })
      );
    }
    const keys = k.split(',');
    keys.forEach(async (key) => {
      if (!serverKey.keys.split(',').includes(key)) {
        const updatedKey = await prismaClient.indexer.update({
          where: {
            type: keyType,
          },
          data: {
            keys: serverKey + ',' + key,
          },
        });
        res.send(
          JSON.stringify({
            message: 'The new indexer have been created successfully',
            data: updatedKey,
          })
        );
      }
    });
  } catch (err) {
    console.log(err);
    res.status(404).send(JSON.stringify({ error: 'this index not exist' }));
  }
};
