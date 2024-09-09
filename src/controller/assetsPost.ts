import { FastifyReply, FastifyRequest } from "fastify";
import { BodyXData } from "../@types";
import { prismaClient } from "../config/db";
import crypto from 'node:crypto'

interface Assets {
  type: 'Component' | 'Script' | 'Page' | 'Snippet';
  content: string;
  title: string;
  uid: string | undefined;
}

export const assetPoster = async (req: FastifyRequest, res: FastifyReply) => {
    const {title, type, content, uid} = req.body as BodyXData<Assets>;
    const newAsset = await prismaClient.assets.create({
      data: {
        title: title,
        type: type,
        content: content,
        uid: typeof uid === 'undefined' ? crypto.randomBytes(80).toString('hex') : uid,
      }
    });
    return res.send(JSON.stringify({assetLink: `/asset?ref=${newAsset.uid}`}))
}