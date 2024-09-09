import { FastifyReply, FastifyRequest } from "fastify";
import { BodyXData } from "../@types";
import { prismaClient } from "../config/db";

export const urlVisitor = async (req: FastifyRequest, res: FastifyReply) => {
  const { url } = req.query as BodyXData<Response>;
  try {
    const urlUpdate = await prismaClient.url.update({
      where: {
        url: url,
      },
      data: {
        visit: {
          increment: 1,
        },
      },
    });
    return res.send(JSON.stringify({success: true, update: urlUpdate.updatedAt}));
  } catch (err) {
    console.error(err);
    return res.code(400).send(JSON.stringify({ error: "Error updating" }));
  }
};

