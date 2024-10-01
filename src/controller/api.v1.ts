import { BodyXData, QueryXData } from 'index';
import { decrypt, encrypt, Service } from '../utils';
import { tokenGenerator } from '../server';
import { prismaClient } from '../config/db';
import { SuperUser } from '../class/SuperUser';
import { Can } from '../utils';
import { Request, Response } from 'express';

const SUPER_USER_PASS_CODE = process.env.SUPER_USER_PASS_CODE;

interface PosterQuery {
  login: string;
  password: string;
  permission: Service;
  defaultRoot: boolean;
}

export const authController = async (req: Request, res: Response) => {
  const { login, password, permission, defaultRoot } =
    req.body as BodyXData<PosterQuery>;

  console.log(req.body);
  req.session.Auth = {
    authenticated: false,
  };

  if (!login || !password || !permission)
    res.status(400).send(JSON.stringify({ error: 'Invalid credentials' }));

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
        res.cookie('connection_time', req.session.Token, {
          expires: cookieExpriration,
        });
        res.redirect(`/service?userId=${Su.userString}&service=${permission}`);
        return;
      } catch (e) {
        console.error(e);
        res.status(404).send('error during service connection');
        return;
      }
    }
    res.status(404).send('error during service connection');
    return;
  }

  const truePassword = decrypt(
    user.password,
    req.session.ServerKeys.secretKey,
    req.session.ServerKeys.iv
  );

  if (truePassword !== password) res.status(403).send('invalid password');

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
    res.cookie('connection_time', req.session.Token, {
      expires: cookieExpriration,
    });
    if (defaultRoot) {
      res.redirect('/home');
      return;
    }
    res.redirect(`/service?userId=${user.id}&service=${permission}`);
    return;
  }

  res.status(403).send('Not Matching Issue');
  return;
};

export const serviceHome = async (req: Request, res: Response) => {
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
  res.cookie('connection_time', req.session.Token, {
    expires: cookieExpriration,
  });

  if (!req.session.Auth.authenticated) {
    res.status(403).send('you cannot access to this service');
    return;
  }

  if (!userId || !service) {
    res.status(404).send('invalid credentials');
    return;
  }

  if (!userId && !service) {
    res.status(404).send('invalid credentials');
    return;
  }

  if (
    isNaN(Number(userId)) &&
    req.session.Auth.isSuperUser &&
    req.session.SuperUser
  ) {
    res.render('serviceHome', {
      service: service,
      auth: true,
      data: { ...req.session.SuperUser },
    });
  }

  if (isNaN(Number(userId))) {
    res.status(404).send('invalide user information');
    return;
  }

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

  if (service !== Service.api && service !== Service.blog) {
    res.redirect(`/signin?service=${service}`);
    return;
  }

  if (!user) {
    res.status(404).send('failed to login');
    return;
  }

  res.render('serviceHome', {
    service: service,
    auth: true,
    data: { ...user },
  });
};

interface TempLinkQuery {
  service: Service;
  forTemp: number;
}

export const tempLinkGenerator = async (req: Request, res: Response) => {
  const { service, forTemp } =
    req.query as unknown as QueryXData<TempLinkQuery>;
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

export const registrationView = async (req: Request, res: Response) => {
  const { service, defailtRoot } = req.query as unknown as QueryXData<Register>;

  console.log(service);
  if (!service) {
    res.send(JSON.stringify({ error: 'Service not found' }));
    return;
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
  if (defailtRoot) {
    res.render('signup', {
      service: service,
      defaultRoot: Boolean(defailtRoot),
    });
    return;
  }
  res.render('signup', {
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

export const registrationController = async (req: Request, res: Response) => {
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
      res.cookie('connection_time', req.session.Token, {
        expires: cookieExpriration,
      });
      res.redirect(
        `/service?userId=${req.session.Auth.login}&service=${service}`
      );
      return;
    } catch (e) {
      console.error(e);
      res.send('something went wrong');
      return;
    }
  }

  if (defaultRoot) {
    res.redirect('/home');
    return;
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
        res.cookie('connection_time', req.session.Token, {
          expires: cookieExpriration,
        });
        res.redirect(
          `/service?userId=${req.session.Auth.id}&service=${service}`
        );
        return;
      }
    } catch (err) {
      console.log(err);
      return;
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
        res.cookie('connection_time', req.session.Token, {
          expires: cookieExpriration,
        });
        res.redirect(
          `/service?userId=${req.session.Auth.id}&service=${service}`
        );
        return;
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
        res.cookie('connection_time', req.session.Token, {
          expires: cookieExpriration,
        });
        res.redirect(
          `/service?userId=${req.session.Auth.id}&service=${service}`
        );
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  throw new Error('Something went wrong');
};

export const connexion = async (req: Request, res: Response) => {
  const { service, defailtRoot } = req.query as QueryXData<{
    service: Service;
    defailtRoot: string;
  }>;
  console.log(service);
  if (!service) {
    res.send(JSON.stringify({ error: 'Service not found' }));
    return;
  }

  if (defailtRoot) {
    res.render('signin', {
      service: service,
      defailtRoot: Boolean(defailtRoot),
    });
    return;
  }
  res.render('signin', { service: service });
};

export const disconnection = async (req: Request, res: Response) => {
  req.session.Auth = {
    authenticated: false,
  };
  res.status(200).send(JSON.stringify({ success: true }));
};
