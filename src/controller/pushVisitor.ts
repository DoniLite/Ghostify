import { FastifyReply, FastifyRequest } from "fastify";
import { BodyXData } from "index";
import { prismaClient } from "../config/db";
import { URL } from "url";

const urlVisitor = async (req: FastifyRequest, res: FastifyReply) => {
  const {url} = req.query as BodyXData<Response>;
  const urlUpdate = await prismaClient.url.update({
    where: {
        id: 1
    },
    data: {
        url: url
    }
  })
};

type Response = {
    url: string
}