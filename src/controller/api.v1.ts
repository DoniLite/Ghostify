import { FastifyReply, FastifyRequest } from 'fastify';
import { BodyXData, QueryXData } from 'index';
import { decrypt, encrypt, Service } from '../utils';
import { tokenGenerator } from '../server';
import { prismaClient } from '../config/db';
import { SuperUser } from '../class/SuperUser';
import { Can } from '../utils';

const SUPER_USER_PASS_CODE = process.env.SUPER_USER_PASS_CODE;

interface PosterQuery {
  login: string;
  password: string;
  permission: Service;
  defaultRoot: boolean;
}

export const authController = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { login, password, permission, defaultRoot } =
    req.body as BodyXData<PosterQuery>;

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
        // const actons = Su.actions;
        req.session.SuperUser = Su;
        req.session.Auth = {
          authenticated: true,
          isSuperUser: true,
          login: Su.userString,
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
      name: user.name,
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
    if (defaultRoot) {
      return res.redirect('/home');
    }
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
    secure: 'auto',
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
  defailtRoot: string;
}

export const registrationView = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { service, defailtRoot } = req.query as QueryXData<Register>;

  console.log(service);
  if (!service) {
    return res.send(JSON.stringify({ error: 'Service not found' }));
  }

  // let d;
  // try {
  //   d = decrypt(
  //     token,
  //     req.session.ServerKeys.secretKey,
  //     req.session.ServerKeys.iv
  //   );
  // } catch (e) {
  //   console.error(e);
  // }

  // const verifier = tokenTimeExpirationChecker(Number(d));
  // if (verifier) {
  //   throw new Error('The validation time expired');
  // }
  if (defailtRoot)
    return res.view('/src/views/signup.ejs', {
      service: service,
      defaultRoot: Boolean(defailtRoot),
    });
  return res.view('/src/views/signup.ejs', {
    service: service,
  });
};

interface RegisterPost {
  service: Service;
  name: string | undefined | null;
  email: string | undefined | null;
  password: string | undefined | null;
  defaultRoot: boolean | undefined | null;
}

export const registrationController = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { service, name, email, password, defaultRoot } =
    req.body as BodyXData<RegisterPost>;

  console.log(name, email, password, service);

  if (!service || !name || !email || !password)
    throw new Error('Invalid credentials');

  const refifyIfUserExists = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (refifyIfUserExists) throw new Error(`User ${email} already exists`);

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
        secure: 'auto',
      });
      return res.redirect(
        `/service?userId=${req.session.Auth.login}&service=${service}`
      );
    } catch (e) {
      console.error(e);
      return res.send('something went wrong');
    }
  }

  if (defaultRoot) {
    return res.redirect('/home');
  }

  if (service === Service.blog) {
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
          secure: 'auto',
        });
        return res.redirect(
          `/service?userId=${req.session.Auth.id}&service=${service}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (service === Service.api) {
    try {
      const cryptedPassword = encrypt(
        password,
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      );
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      const token = tokenGenerator(date.toDateString());
      const user = await prismaClient.user.create({
        data: {
          name: name,
          email: email,
          service: service,
          token: token,
          password: cryptedPassword,
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
          secure: 'auto',
        });
        return res.redirect(
          `/service?userId=${req.session.Auth.id}&service=${service}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (service === Service.superUser) {
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
          secure: 'auto',
        });
        return res.redirect(
          `/service?userId=${req.session.Auth.id}&service=${service}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  throw new Error('Something went wrong');
};

export const connexion = async (req: FastifyRequest, res: FastifyReply) => {
  const { service, defailtRoot } = req.query as QueryXData<{
    service: Service;
    defailtRoot: string;
  }>;
  console.log(service);
  if (!service) {
    return res.send(JSON.stringify({ error: 'Service not found' }));
  }

  if (defailtRoot)
    return res.view('/src/views/signin.ejs', {
      service: service,
      defailtRoot: Boolean(defailtRoot),
    });
  return res.view('/src/views/signin.ejs', { service: service });
};

export const disconnection = async (req: FastifyRequest, res: FastifyReply) => {
  req.session.Auth = {
    authenticated: false,
  };
  return res.code(200).send(JSON.stringify({ success: true }));
};
