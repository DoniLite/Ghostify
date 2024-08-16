import { FastifyReply, FastifyRequest } from "fastify";
import {Assets} from '@prisma/client'
import { BodyXData } from "../@types";


export const assetPoster = async (req: FastifyRequest, res: FastifyReply) => {
    const {title, type, content} = req.body as BodyXData<Assets>;
    
}