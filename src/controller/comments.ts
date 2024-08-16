import { FastifyReply, FastifyRequest } from "fastify";
import { BodyXData } from "index";


export const comment = async (req: FastifyRequest, res: FastifyReply) => {
    const {} = req.body as BodyXData;
}