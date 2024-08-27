import { FastifyReply, FastifyRequest } from "fastify";
import { BodyXData } from "index";


export const uploadActu = async (req: FastifyRequest, res: FastifyReply) => {
    const {title, content, file} = req.body as BodyXData;
    
}