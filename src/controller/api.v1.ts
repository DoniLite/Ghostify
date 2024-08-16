import { FastifyReply, FastifyRequest } from "fastify";
import { BodyXData, QueryXData } from "../@types";
import {
  decrypt,
  encrypt,
  Service,
  tokenTimeExpirationChecker,
} from "../utils";
import { tokenGenerator } from "../server";
import { prismaClient } from "../config/db";

type PosterQuery = {
  token: string | undefined;
  permission: Service;
};

export const posterController = async (req: FastifyRequest, res: FastifyReply) => {
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
  const date = new Date();
  date.setHours(date.getHours() + Number(forTemp));
  const expiration = date.getTime();
  const token = encrypt(
    expiration.toString(),
    req.session.ServerKeys.secretKey,
    req.session.ServerKeys.iv
  );
  const linkPayload = `https//gostify.site/register?service=${service}&token=${token}`;
  res.send(JSON.stringify(linkPayload));
};

type Register = {
  service: Service;
  token: string | undefined | null;
};

export const registrationView = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { service, token } = req.query as QueryXData<Register>;

  if (!service || !token) {
    throw new Error("Invalid service  or registration");
  }

  let d;
  try {
    d = decrypt(
      token,
      req.session.ServerKeys.secretKey,
      req.session.ServerKeys.iv
    );
  } catch (e) {
    console.error(e);
  }

  const verifier = tokenTimeExpirationChecker(Number(d));
  if (verifier) {
    throw new Error("The validation time expired");
  }
  res.view("/src/views/signup.ejs", { service: service });
};

type RegisterPost = {
  service: Service;
  name: string | undefined | null;
  email: string | undefined | null;
  password: string | undefined | null;
};

export const registrationController = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { service, name, email, password } =
    req.body as BodyXData<RegisterPost>;

  if (service === "blog") {
    try {
      const cryptedPassword = encrypt(
        password,
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      );
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      const registrationTime = date.getTime();
      const token = tokenGenerator(String(registrationTime));
      const user = await prismaClient.user.create({
        data: {
          name: name,
          email: email,
          service: service,
          token: token,
          password: cryptedPassword,
          registration: date,
        },
      });
      if (user) {
        return res.redirect(200, '/poster');
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (service === 'api') {
    try {
      const cryptedPassword = encrypt(
        password,
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      );
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      const credits = 100;
      const token = tokenGenerator(date.toDateString());
      const user = await prismaClient.user.create({
        data: {
          name: name,
          email: email,
          service: service,
          token: token,
          password: cryptedPassword,
          credits: credits
        },
      });
      if (user) {
        return res.redirect(200, "/poster");
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (service === 'superUser') {
    try {
      const cryptedPassword = encrypt(
        password,
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      );
      const date = new Date();
      date.setMonth(date.getMonth() + 6);
      const registrationTime = date.getTime();
      const token = tokenGenerator(String(registrationTime));
      const user = await prismaClient.user.create({
        data: {
          name: name,
          email: email,
          service: service,
          token: token,
          password: cryptedPassword,
          registration: date,
        },
      });
      if (user) {
        return res.redirect(200, "/poster");
      }
    } catch (err) {
      console.log(err);
    }
  }

  throw new Error('Something went wrong')
};

export const connexion = async (req: FastifyRequest, res: FastifyReply) => {
  const { service } = req.query as QueryXData<{service: Service}>;
  console.log(service)
  if (!service) {
    return res.send(JSON.stringify({error: 'Service not found'}));
  }
  return res.view("/src/views/signin.ejs", { service: service });
};

export const connexionController = (req: FastifyRequest, res: FastifyReply) => {
  const {} = req.body as BodyXData;
  
}
