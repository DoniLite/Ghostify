import { FastifyReply, FastifyRequest } from 'fastify';
import { BodyXData, QueryXData } from 'index';
import {
  decrypt,
  encrypt,
  Service,
  tokenTimeExpirationChecker,
} from '../utils';
import { tokenGenerator } from '../server';
import { prismaClient } from '../config/db';
import { SuperUser } from '../class/SuperUser';
import { Can } from '../utils';

const SUPER_USER_PASS_CODE = process.env.SUPER_USER_PASS_CODE;

interface PosterQuery {
  login: string;
  password: string;
  permission: Service;
}

export const authController = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { login, password, permission } = req.body as BodyXData<PosterQuery>;

  console.log(req.body);
  req.session.Auth = {
    authenticated: false,
  };

  if (!login || !password || !permission)
    return res.code(400).send(JSON.stringify({ error: 'Invalid credentials' }));

  const user = await prismaClient.user.findUnique({
    where: {
      email: login,
    },
  });

  if (!user) {
    const spltPass = password.split(';');
    if (
      (spltPass[1] === SUPER_USER_PASS_CODE && permission === Service.api) ||
      permission === Service.blog
    ) {
      try {
        const Su = new SuperUser(login, spltPass[0]);
        Su.checkPermissions();
        req.session.SuperUser = Su;
        req.session.Auth = {
          authenticated: true,
          isSuperUser: true,
        };
        const cookieExpriration = new Date();
        cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
        req.session.Token = encrypt(
          cookieExpriration.getTime().toString(),
          req.session.ServerKeys.secretKey,
          req.session.ServerKeys.iv
        );
        res.setCookie('connection_time', req.session.Token, {
          expires: cookieExpriration,
        });
        return res.redirect(
          `/service?userId=${Su.userString}&service=${permission}`
        );
      } catch (e) {
        console.error(e);
        return res.code(404).send('error during service connection');
      }
    }
    return res.code(404).send('error during service connection');
  }

  const truePassword = decrypt(
    user.password,
    req.session.ServerKeys.secretKey,
    req.session.ServerKeys.iv
  );

  if (truePassword !== password) return res.code(403).send('invalid password');

  if (permission === Service.blog || permission === Service.api) {
    req.session.Auth = {
      authenticated: true,
      isSuperUser: false,
      login: login,
      id: user.id,
    };
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    req.session.Token = encrypt(
      cookieExpriration.getTime().toString(),
      req.session.ServerKeys.secretKey,
      req.session.ServerKeys.iv
    );
    res.setCookie('connection_time', req.session.Token, {
      expires: cookieExpriration,
    });
    return res.redirect(`/service?userId=${user.id}&service=${permission}`);
  }

  return res.code(403).send('Not Matching Issue');
};

export const serviceHome = async (req: FastifyRequest, res: FastifyReply) => {
  const { userId, service } = req.query as QueryXData<{
    userId: string;
    service: Service;
  }>;

  const cookieExpriration = new Date();
  cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
  req.session.Token = encrypt(
    cookieExpriration.getTime().toString(),
    req.session.ServerKeys.secretKey,
    req.session.ServerKeys.iv
  );
  res.setCookie('connection_time', req.session.Token, {
    expires: cookieExpriration,
  });

  if (!req.session.Auth.authenticated)
    return res.code(403).send('you cannot access to this service');

  if (!userId || !service) return res.code(404).send('invalid credentials');

  if (!userId && !service) return res.code(404).send('invalid credentials');

  if (
    isNaN(Number(userId)) &&
    req.session.Auth.isSuperUser &&
    req.session.SuperUser
  ) {
    return res.view('/src/views/serviceHome.ejs', {
      service: service,
      auth: true,
      data: { ...req.session.SuperUser },
    });
  }

  if (isNaN(Number(userId)))
    return res.code(404).send('invalide user information');

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

  if (service !== Service.api && service !== Service.blog)
    return res.redirect(`/signin?service=${service}`);

  if (!user) return res.code(404).send('failed to login');

  return res.view('/src/views/serviceHome.ejs', {
    service: service,
    auth: true,
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

  const spltPass = password.split(';');
  if (spltPass.length > 1 && spltPass[1] === SUPER_USER_PASS_CODE) {
    try {
      const Su = new SuperUser(name, spltPass[0], false, [Can.CreateUser]);
      Su.checkPermissions();
      req.session.Auth = {
        authenticated: true,
        id: Number(Su.health),
        login: Su.userString,
        isSuperUser: true,
      };
      const cookieExpriration = new Date();
      cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
      req.session.Token = encrypt(
        cookieExpriration.getTime().toString(),
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      );
      res.setCookie('connection_time', req.session.Token, {
        expires: cookieExpriration,
      });
      return res
        .code(200)
        .redirect(
          `/service?userId=${req.session.Auth.login}&service=${service}`
        );
    } catch (e) {
      console.error(e);
      return res.code(403);
    }
  }

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
          permission: 'User',
        },
      });
      if (user) {
        req.session.Auth = {
          authenticated: true,
          id: user.id,
          login: user.email,
          isSuperUser: false,
        };
        const cookieExpriration = new Date();
        cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
        req.session.Token = encrypt(
          cookieExpriration.getTime().toString(),
          req.session.ServerKeys.secretKey,
          req.session.ServerKeys.iv
        );
        res.setCookie('connection_time', req.session.Token, {
          expires: cookieExpriration,
        });
        return res
          .code(200)
          .redirect(
            `/service?userId=${req.session.Auth.login}&service=${service}`
          );
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
          permission: 'User',
        },
      });
      if (user) {
        req.session.Auth = {
          authenticated: true,
          id: user.id,
          login: user.email,
          isSuperUser: false,
        };
        const cookieExpriration = new Date();
        cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
        req.session.Token = encrypt(
          cookieExpriration.getTime().toString(),
          req.session.ServerKeys.secretKey,
          req.session.ServerKeys.iv
        );
        res.setCookie('connection_time', req.session.Token, {
          expires: cookieExpriration,
        });
        return res
          .code(200)
          .redirect(
            `/service?userId=${req.session.Auth.login}&service=${service}`
          );
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
          permission: 'User',
        },
      });
      if (user) {
        req.session.Auth = {
          authenticated: true,
          id: user.id,
          login: user.email,
          isSuperUser: false,
        };
        const cookieExpriration = new Date();
        cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
        req.session.Token = encrypt(
          cookieExpriration.getTime().toString(),
          req.session.ServerKeys.secretKey,
          req.session.ServerKeys.iv
        );
        res.setCookie('connection_time', req.session.Token, {
          expires: cookieExpriration,
        });
        return res
          .code(200)
          .redirect(
            `/service?userId=${req.session.Auth.login}&service=${service}`
          );
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

export const disconnection = async (req: FastifyRequest, res: FastifyReply) => {
  req.session.Auth = {
    authenticated: false,
  };
  return res.code(200).send(JSON.stringify({ success: true }));
};
