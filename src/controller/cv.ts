import { FastifyReply, FastifyRequest } from "fastify";


export const cv = async(req: FastifyRequest, res: FastifyReply) => {
    return res.view('/src/views/components/cv.ejs', {service: undefined});
}