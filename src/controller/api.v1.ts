import { FastifyReply, FastifyRequest } from "fastify";
import { QueryXData } from "index";
import { Service } from "../utils";
import { tokenGenerator } from "../server";

type PosterQuery = {
  token: string | undefined;
  permission: Service;
};

export const poster = async (req: FastifyRequest, res: FastifyReply) => {
  const { token, permission } = req.query as QueryXData<PosterQuery>;
  let dateStemp;

  req.jwtDecode();
  if (!token) {
    return res.view("/src/views/article.ejs", {
      pagination: 1,
      activeIndex: 3,
    });
  }

  if (token !== "SPECIAL") {
    res.status(403);
    return res.send(JSON.stringify({ error: "Access denied" }));
  }

  if (permission === "blog") {
    dateStemp = token;
    const date = new Date();
  }
};

type TempLinkQuery = {
  service: Service;
  forTemp: number;
};

export const tempLinkGenerator = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { service, forTemp } = req.query as QueryXData<TempLinkQuery>;
  const date = new Date()
  date.setHours(date.getHours() + forTemp)
  const expiration = date.getTime()
  const token = tokenGenerator(expiration.toString())
  const linkPayload = `https//gostify.site/register?service=${service}&expiration=${expiration}&token=${token}`
  res.send(JSON.stringify(linkPayload));
};

type Register = {
  service: Service,
  registration: string | undefined,
  token: string,
}

export const registration = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
    const {service, registration, token} = req.query as QueryXData<Register>;

    if(!service || !token ) {
      throw new Error("Invalid service  or registration");
    }

};

export const connexion = async (req: FastifyRequest, res: FastifyReply) => {
  const { service } = req.query as QueryXData;
};
