import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryXData } from 'index';
import { prismaClient } from '../config/db';
import { error } from 'console';

export const find = async (req: FastifyRequest, res: FastifyReply) => {
  const { q } = req.query as QueryXData;
  const allIndexer = await prismaClient.indexer.findMany();
  let allResources;
  const result = allIndexer.filter((index) => {
    const keys = index.keys.split(',');
    return keys.includes(q);
  });
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
    const actus = await prismaClient.actu.findMany({
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
      ...urls,
      ...posts,
      ...games,
      ...assets,
      ...actus,
      ...projecs,
    ];
    allResources.sort();
  });
  return res.send(JSON.stringify({ data: allResources }));
};

type KeyQuery = {
  keyType: string;
  k: string;
};

export const updateKeys = async (req: FastifyRequest, res: FastifyReply) => {
  const { k, keyType } = req.query as QueryXData<KeyQuery>;
  try {
    const serverKey = await prismaClient.indexer.findUnique({
      where: {
        type: keyType,
      },
    });
    const keys = k.split(',');
    keys.forEach(async (key) => {
      if (!serverKey.keys.split(',').includes(key)) {
        await prismaClient.indexer.update({
          where: {
            type: keyType,
          },
          data: {
            keys: serverKey + ',' + key,
          },
        });
        
      }
    });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .send(JSON.stringify({ error: 'this index not exist' }));
  }
};
