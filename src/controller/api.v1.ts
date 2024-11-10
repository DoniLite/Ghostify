import { BodyXData, QueryXData } from 'index';
import { compareHash, encrypt, hashSomething, Service, unify } from '../utils';
import { tokenGenerator } from '../server';
import { prismaClient } from '../config/db';
import { SuperUser } from '../class/SuperUser';
import { Can } from '../utils';
import { Request, Response } from 'express';
import path from 'node:path';

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

  if (!login || !password || !permission) {
    res.status(400).send(JSON.stringify({ error: 'Invalid credentials' }));
    return;
  }

  const user = await prismaClient.user.findUnique({
    where: {
      email: login,
    },
  });

  if (!user) {
    const spltPass = password.split(';');
    if (
      (spltPass[1] === SUPER_USER_PASS_CODE && permission === Service.api) ||
      permission === Service.poster
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

  const verifiedPassword = await compareHash(password, user.password);

  // const truePassword = decrypt(
  //   user.password,
  //   req.session.ServerKeys.secretKey,
  //   req.session.ServerKeys.iv
  // );

  if (!verifiedPassword) {
    res.status(403).send('invalid password');
    return;
  }

  if (permission === Service.poster || permission === Service.api) {
    req.session.Auth = {
      authenticated: true,
      isSuperUser: false,
      login: login,
      id: user.id,
      file: user.file,
      username: user.username,
      fullname: user.fullname,
    };
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    req.session.Token = encrypt(
      cookieExpriration.getTime().toString(),
      req.session.ServerKeys.secretKey,
      req.session.ServerKeys.iv
    );
    console.log('before cookie setting');
    res.cookie('connection_time', req.session.Token, {
      expires: cookieExpriration,
    });
    console.log('after cookie setting');
    if (defaultRoot) {
      console.log('redirecting to default root path');
      res.redirect('/home');
      return;
    }
    console.log('rediecting to service view');
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

  if (!req.session.Auth.authenticated || !req.session.Auth) {
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
    return;
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
      email: true,
      service: true,
      registration: true,
    },
  });

  if (service !== Service.api && service !== Service.poster) {
    res.redirect(`/signin?service=${service}`);
    return;
  }

  if (!user) {
    res.status(404).send('failed to login');
    return;
  }

  const userDocs = req.session.Auth.id
    ? await prismaClient.document.findMany({
        where: {
          userId: req.session.Auth.id,
        },
      })
    : [];

  res.render('serviceHome', {
    service: service,
    auth: true,
    data: { ...user, userDocs },
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
  email: string | undefined | null;
  password: string | undefined | null;
  defaultRoot: boolean | undefined | null;
  fullname: string | undefined | null;
}

export const registrationController = async (req: Request, res: Response) => {
  const { service, email, password, defaultRoot, fullname } =
    req.body as BodyXData<RegisterPost>;

  if (process.env.NODE_ENV !== 'production')
    console.log(email, password, service);

  if (!service || !email || !password) throw new Error('Invalid credentials');

  const refifyIfUserExists = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (refifyIfUserExists) throw new Error(`User ${email} already exists`);

  const spltPass = password.split(';');
  if (spltPass.length > 1 && spltPass[1] === SUPER_USER_PASS_CODE) {
    try {
      const Su = new SuperUser(email, spltPass[0], false, [Can.CreateUser]);
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
      if (defaultRoot) {
        res.redirect('/home');
        return;
      }
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

  if (service === Service.poster) {
    try {
      const cryptedPassword = await hashSomething(password);
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      const registrationTime = date.getTime();
      const token = tokenGenerator(String(registrationTime));
      const user = await prismaClient.user.create({
        data: {
          email: email,
          service: service,
          token: token,
          fullname,
          password: cryptedPassword,
          registration: date,
          permission: 'User',
        },
      });
      if (user) {
        req.session.Auth = {
          authenticated: true,
          fullname: user.fullname,
          username: user.username,
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
        if (defaultRoot) {
          res.redirect('/home');
          return;
        }
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
      const cryptedPassword = await hashSomething(password);
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      const token = tokenGenerator(date.toDateString());
      const user = await prismaClient.user.create({
        data: {
          email: email,
          service: service,
          token: token,
          fullname,
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
          fullname: user.fullname,
          username: user.username,
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
      const cryptedPassword = await hashSomething(password);
      const date = new Date();
      date.setMonth(date.getMonth() + 6);
      const registrationTime = date.getTime();
      const token = tokenGenerator(String(registrationTime));
      const user = await prismaClient.user.create({
        data: {
          email: email,
          service: service,
          token: token,
          password: cryptedPassword,
          registration: date,
          permission: 'User',
          fullname,
        },
      });
      if (user) {
        req.session.Auth = {
          authenticated: true,
          id: user.id,
          login: user.email,
          isSuperUser: false,
          fullname: user.fullname,
          username: user.username,
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

interface Parser {
  /**
   * the document extension it will be integrated by the the program to know which parser it will use
   */
  ext: 'html' | 'md' | 'json' | 'ascii';
  /**
   * the string representation of the document that have to be parsed
   */
  content: string;
  /**
   * the target format that the document will be transformed into
   */
  target: 'html' | 'json' | 'md';
}
export const parserRoute = async (req: Request, res: Response) => {
  const { ext, content, target } = req.body as BodyXData<Parser>;
  console.log(req.body);

  if (!ext || !content || !target) {
    res
      .status(400)
      .send(
        JSON.stringify({ message: 'Missing required fields', success: false })
      );
    return;
  }

  if (ext === 'md' && target === 'html') {
    const unifying = await unify(content);
    res.status(200).send(JSON.stringify({ success: true, data: unifying }));
    return;
  }

  if (ext === 'html' && target === 'md') {
    res.app.emit('reversion', { ext, target });
    return;
  }

  res.json({
    message: 'this feature ' + target + ' is not implemented for now',
    success: false,
  });
};

export const getMd = async (req: Request, res: Response) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.sendFile(path.resolve(__dirname, '../../src/public/md.css'));
};

export const getMdScript = async (req: Request, res: Response) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.sendFile(path.resolve(__dirname, '../../src/public/script/md.js'));
};

export const googleAuth = async (req: Request, res: Response) => {
  const user = req.user as number;
  // console.log(user);
  const authUser = await prismaClient.user.findUnique({
    where: {
      id: user,
    },
  });
  req.session.Auth = {
    authenticated: true,
    isSuperUser: false,
    id: authUser.id,
    username: authUser.username,
    fullname: authUser.fullname,
    file: authUser.file,
    login: authUser.email,
  };
  // req.session.Auth = {
  //   authenticated: true,
  //   id: user.id,
  //   login: user.email,
  //   isSuperUser: false,
  //   name: user.username,
  //   file: user.file,
  // };
  res.redirect('/home');
};
