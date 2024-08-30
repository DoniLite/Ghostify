import { FastifyReply, FastifyRequest } from 'fastify';
import { BodyXData, QueryXData } from '../@types';
import {
  decrypt,
  encrypt,
  Service,
  tokenTimeExpirationChecker,
} from '../utils';
import { tokenGenerator } from '../server';
import { prismaClient } from '../config/db';

interface PosterQuery {
  email: string;
  password: string;
  permission: Service;
}

export const authController = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { email, password, permission } = req.body as BodyXData<PosterQuery>;

  if (!email || !password || !permission)
    return res.code(400).send(JSON.stringify({ error: 'Invalid credentials' }));

  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) return res.code(404);

  const truePassword = decrypt(
    user.password,
    req.session.ServerKeys.secretKey,
    req.session.ServerKeys.iv
  );

  if (truePassword !== password) return res.code(403).send('invalid password');

  if (permission === Service.blog || permission === Service.api)
    return res.view('/src/views/serviceHome.ejs', { service: permission });

  return res.code(403).send('Not Matching Issue');
};

export const serviceHome = async (req: FastifyRequest, res: FastifyReply) => {
  const { userId, service } = req.query as QueryXData<{
    userId: string;
    service: Service;
  }>;

  if (!userId || !service) return res.code(404);

  const user = await prismaClient.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      name: true,
      email: true,
      service: true,
      registration: true,
      credits: true,
    },
  });
  
  if (!user) return res.redirect('/signin?service=blog');

  if (service !== Service.api && service !== Service.blog)
    return res.redirect('/signin?service=blog');

  return res.view('/src/views/serviceHome.ejs', {
    service: service,
    data: { ...user },
  });
};

interface TempLinkQuery {
  service: Service;
  forTemp: number;
}

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

interface Register {
  service: Service;
  token: string | undefined | null;
}

export const registrationView = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { service, token } = req.query as QueryXData<Register>;

  if (!service || !token) {
    throw new Error('Invalid service  or registration');
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
    throw new Error('The validation time expired');
  }
  res.view('/src/views/signup.ejs', { service: service });
};

interface RegisterPost {
  service: Service;
  name: string | undefined | null;
  email: string | undefined | null;
  password: string | undefined | null;
}

export const registrationController = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { service, name, email, password } =
    req.body as BodyXData<RegisterPost>;

  if (service === 'blog') {
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
          credits: credits,
        },
      });
      if (user) {
        return res.redirect(200, '/poster');
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
        return res.redirect(200, '/poster');
      }
    } catch (err) {
      console.log(err);
    }
  }

  throw new Error('Something went wrong');
};

export const connexion = async (req: FastifyRequest, res: FastifyReply) => {
  const { service } = req.query as QueryXData<{ service: Service }>;
  console.log(service);
  if (!service) {
    return res.send(JSON.stringify({ error: 'Service not found' }));
  }
  return res.view('/src/views/signin.ejs', { service: service });
};
