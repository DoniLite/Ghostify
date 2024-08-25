import { FastifyReply, FastifyRequest } from "fastify";
import {} from '@prisma/client'
import { BodyXData } from "../@types";

type Assets = {
  type: string;
  content: string;
  title: string;
  indexed: boolean;
  indexerId: number | null;
};

export const assetPoster = async (req: FastifyRequest, res: FastifyReply) => {
    const {title, type, content} = req.body as BodyXData<Assets>;
    
}