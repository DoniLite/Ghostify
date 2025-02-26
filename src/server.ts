'use strict';
// @ts-types="@types/express"
import express, { RequestHandler } from 'express';
// ts-types="@types/ejs"
import ejs from 'ejs';
// ts-types="@types/body-parser"
import bodyParser from 'body-parser';
// @ts-types="@types/express-session"
import session from 'express-session';
// @ts-types="@types/cookie-parser"
import cookie from 'cookie-parser';
import { prismaClient } from './config/db.ts';
import { ReqParams } from './@types/index.d.ts';
// @ts-types="@types/cors"
import cors from 'cors';
import { home } from './routes/home.ts';
import { homeController } from './controller/home.ts';
import dotEnv from 'dotenv';
// @ts-types="@types/jsonwebtoken"
import jwt, { SignOptions } from 'jsonwebtoken';
import { store } from './controller/store.ts';
import { notifications } from './controller/notifications.ts';
import { webhooks } from './controller/webhooks.ts';
import { sessionStorageHook } from './hooks/sessionStorage.ts';
import {
  about,
  conditions,
  FAQ,
  license,
  policy,
  terms,
} from './routes/assets.ts';
// import { stats } from './hooks/statCounter';
import { articlePost } from './controller/articlePost.ts';
import { projectPost } from './controller/projectPost.ts';
import { blog } from './routes/blog.ts';
import { EventEmitter, on } from 'node:events';
import {
  authController,
  connexion,
  disconnection,
  googleAuth,
  parserRoute,
  registrationController,
  registrationView,
  serviceHome,
} from './controller/api.v1.ts';
import {
  conversionView,
  docSaver,
  docView,
  loadPost,
  parserController,
  poster,
  requestComponent,
  requestHeadComponent,
  requestListComponent,
  updateDocView,
} from './routes/poster.ts';
import { find } from './controller/finder.ts';
import { assetPoster } from './controller/assetsPost.ts';
// import fastifyRedis from '@fastify/redis';
// import RedisStore from 'connect-redis';
import { setUp } from './hooks/setup.ts';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// import { stats } from './hooks/statCounter';
import { verify } from './hooks/verify.ts';
// import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import i18n from 'i18n';
// @ts-types="@types/connect-sqlite3"
import sql3 from 'connect-sqlite3';
import { redirector } from './hooks/redirector.ts';
import { projects } from './routes/project.ts';
import { meta } from './routes/meta.ts';
import { contact } from './routes/contact.ts';
// @ts-types="@types/passport"
import passport from 'passport';
// @ts-types="@types/passport-google-oauth20"
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { test as testRoute } from './routes/tRoute.ts';
// @ts-types="@types/express-ws"
import expressWs, { Application } from 'express-ws';
import {
  checkIfUserExist,
  updateProfile,
  updateUserName,
} from './routes/user.ts';
import { downloader, serveStatic } from './routes/serveStatic.ts';
import { cv, processCV } from './controller/processCv.ts';
import { checkCVStatus, cvProcessAPI, getCV, getCVTheme } from './routes/cv.ts';
import Queue from 'bull';
import { cvDownloader, getTimeElapsed, verifyJWT } from './utils.ts';
import { billing } from './routes/billing.ts';
import { documentView } from './routes/doc.ts';
import { logger } from './logger.ts';
import { onStat } from './hooks/events.ts';
import { stats } from './hooks/statCounter.ts';
import { auth, ROUTES } from './hooks/auth.ts';
import { Notifications, NotificationType } from '@prisma/client';
import { NotificationBus } from './class/NotificationBus.ts';
import { feed, reactions } from './routes/feed.ts';
import { comment } from './controller/comments.ts';
import { webfont } from './routes/fonts.ts';
import { translator } from './routes/translate.ts';
import process from 'node:process';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env['GOOGLE_CLIENT_ID'] as string,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] as string,
      callbackURL:
        process.env.NODE_ENV === 'production'
          ? 'https://ghostify.site/login/federated/google'
          : 'http://localhost:3085/login/federated/google',
      scope: ['profile'],
      state: true,
    },
    async (_accessToken, _refreshToken, profile, cb) => {
      const verifEmail = profile._json.email;
      const { picture } = profile._json;
      const userId = profile.id;
      const fullname = `${profile!.name?.givenName} ${
        profile!.name?.familyName
      }`;
      if (!verifEmail) {
        const error = new Error('User not authenticated');
        cb(error, undefined);
        return;
      }
      try {
        const checkExistedUser = await prismaClient.user.findUnique({
          where: { email: verifEmail },
        });
        if (checkExistedUser && checkExistedUser.providerId !== userId) {
          const error = new Error(
            `User ${profile!.emails![0].value} already exists`
          );
          cb(error, undefined);
          return;
        }
        if (checkExistedUser && checkExistedUser.providerId === userId) {
          cb(null, checkExistedUser.id);
          return;
        }
        const newUser = await prismaClient.user.create({
          data: {
            email: verifEmail,
            provider: 'Google',
            permission: 'User',
            file: picture,
            providerId: userId,
            fullname,
          },
        });
        cb(null, newUser.id);
      } catch (err) {
        cb(err, undefined);
      }
    }
  )
);

passport.serializeUser((userId, done) => {
  process.nextTick(function () {
    done(null, userId);
  });
});

passport.deserializeUser((userId, done) => {
  process.nextTick(async function () {
    try {
      const user = await prismaClient.user.findUnique({
        where: { providerId: String(userId) },
      });
      return done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
});

i18n.configure({
  locales: ['en', 'fr', 'es'], // Liste des langues supportées
  directory: path.resolve(process.cwd(), './locales'), // Répertoire où se trouvent les fichiers de traduction
  defaultLocale: 'fr', // Langue par défaut
  queryParameter: 'lang',
  cookie: 'lang',
  autoReload: true,
  updateFiles: false,
  objectNotation: true,
});

// export const Store = new RedisStore({
//   client: process.env.NODE_ENV === 'production' ? client : redisStoreClient,
// });

const SQLStore = sql3(session);

export const ee = new EventEmitter();

dotEnv.config();
const server = express();
expressWs(server as unknown as Application);
// const socketUrl =
//   process.env.NODE_ENV !== 'production'
//     ? 'ws://localhost/notifications'
//     : 'ws://ghostify.site/notifications';
const viewsPath = path.resolve(process.cwd(), '/views');
server.engine('html', ejs.renderFile);
server.set('view engine', 'ejs');
server.set('views', viewsPath);
// {logger: true}

// Hooks...

// server.addHook('onResponse', stats);

export const tokenGenerator = (payload: string, opt?: SignOptions) => {
  if (opt) {
    return jwt.sign(payload, process.env.JWT_SECRET!, opt);
  }
  return jwt.sign(payload, process.env.JWT_SECRET!);
};

server.use(i18n.init);

// Détecter la langue via les paramètres de requête
server.use((req, res, next) => {
  const lang = (req.query.lang as string) || 'fr'; // Par défaut 'en' si la langue n'est pas spécifiée
  res.setLocale(lang);
  next();
});

server.use(rateLimit() as unknown as RequestHandler);

server.options('*', cors());

// export const config = {
//   //+
//   contentSecurityPolicy: {
//     //+
//     useDefaults: true, //+
//     directives: {
//       //+
//       'default-src': ["'self'"], //+
//       'script-src': [
//         //+
//         "'self'", //+
//         (req: express.Request, res: express.Response) =>
//           `'nonce-${res.locals.cspNonce}'`, //+
//       ], //+
//       'style-src': [
//         //+
//         "'self'", // already existing//+
//         (req: express.Request, res: express.Response) =>
//           `'nonce-${res.locals.cspNonce}'`, //+
//         'https://fonts.googleapis.com',
//       ], //+
//       'font-src': [
//         "'self'",
//         (req: express.Request, res: express.Response) =>
//           `'nonce-${res.locals.cspNonce}'`,
//         'https://fonts.gstatic.com',
//       ], //+
//       'connect-src': ["'self' ws://localhost:3081 wss://0.0.0.0:3081"],
//       // Add other directives if necessary//+
//     }, //+
//   }, //+
//   crossOriginEmbedderPolicy: false, // Disable for external resources//+
//   crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow certain cross-origin resources//+
// };
server.use((_req, res, next) => {
  // Générer un nonce unique pour chaque requête
  res.locals.cspNonce = crypto.randomBytes(32).toString('hex');
  next();
});
server.use(
  //+
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: [
          "'self'",
          'https://eu-assets.i.posthog.com',
          (_req, res) => `'nonce-${res.locals.cspNonce}'`,
        ],
        scriptSrcElem: [
          "'self'",
          'https://eu-assets.i.posthog.com/static/array.js',
          (_req, res) => `'nonce-${res.locals.cspNonce}'`,
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
        connectSrc: [
          "'self'",
          'ws://localhost:3085',
          'wss://0.0.0.0:3085',
          'ws://ghostify.site',
          'wss://ghostify.site',
          'https://eu.posthog.com',
          'https://eu-assets.i.posthog.com',
        ],
        imgSrc: ["'self'", 'data:', 'https://lh3.googleusercontent.com'],
      },
    },
  }) //+
);
// server.use(
//   helmet.crossOriginResourcePolicy({
//     policy: 'cross-origin',
//   })
// );
// server.use((req, res, next) => {
//   res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
//   next();
// });
server.use(
  cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST'],
    credentials: true,
  })
);
server.use(
  '/static',
  express.static(path.resolve(process.cwd(), '/src/public'), {
    maxAge: '1d', // Définit une durée de vie du cache de 1 jour
    etag: false, // Désactive les ETags (facultatif)
    setHeaders:
      process.env.NODE_ENV !== 'production'
        ? undefined
        : (res) => {
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 86400 secondes = 1 jour
          },
  })
);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookie(process.env.SESSION_SECRET) as unknown as RequestHandler);
const sessionStorePath = path.resolve(process.cwd(), '/src/config');


server.use(
  session({
    secret: process.env.SESSION_SECRET!,
    cookie: {
      secure: 'auto',
    },
    name: 'sessionId',
    store: new SQLStore({
      db:
        process.env.NODE_ENV === 'production'
          ? 'sessionProduction.db'
          : 'sessions.db',
      dir: sessionStorePath,
    }) as session.Store,
    saveUninitialized: false,
    resave: false,
  }) as unknown as RequestHandler
);

server.use(sessionStorageHook);
server.use(ROUTES, auth);

server.use(passport.initialize() as unknown as RequestHandler);
server.use(passport.authenticate('session'));
server.use(passport.session());

// server.use(stats);
server.use(verify);
server.use(redirector);

server.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'] as string;
  const userId = req.headers['x-user-id'] as string;

  // Si une clé API est fournie, vérifier sa validité
  if (apiKey) {
    try {
      const tokenPayload = verifyJWT(apiKey);

      logger.info(`new connection with the payload: ${tokenPayload}`);

      // S'assurer que req.session et req.session.Auth existent

      req.session!.Auth!.authenticated = true;
      if (userId) {
        req.session!.Auth!.id! = Number(userId);
      }

      next(); // Appeler next() uniquement si le token est valide
    } catch (err) {
      // Si le token est invalide, bloquer la requête
      console.error('JWT Verification Error:', err);
      res.status(401).json({
        message: 'Invalid or expired API key',
      });
    }
  } else {
    // Pas de token, continuer normalement
    next();
  }
});

// Middleware pour invalider les sessions API
server.use((req, res, next) => {
  res.on('finish', () => {
    // Vérifier la présence de l'en-tête et d'une session
    if (req.headers['x-api-key'] && req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        } else {
          console.log('Session successfully destroyed for API request');
        }
      });
    }
  });
  next();
});

server.use((req, _res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  ee.emit('stat', req.url);
  next();
});

export enum SocketEventType {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
  NOTIFICATION = 'notification',
}
// Websocket routes
server.ws('/', (socket) => {
  const notifications = new NotificationBus();
  const eeType = notifications.eventType;

  ee.on(eeType.Alert, (data) => {
    socket.send(
      JSON.stringify({
        flash: true,
        type: SocketEventType.MESSAGE,
        data,
      })
    );
  });

  ee.on(eeType.Info, (data) => {
    socket.send(
      JSON.stringify({
        flash: true,
        type: SocketEventType.NOTIFICATION,
        data,
      })
    );
  });

  ee.on(eeType.Message, (data) => {
    socket.send(
      JSON.stringify({
        flash: true,
        type: SocketEventType.MESSAGE,
        data,
      })
    );
  });

  ee.on(eeType.Post, (data) => {
    socket.send(
      JSON.stringify({
        flash: true,
        type: SocketEventType.NOTIFICATION,
        data,
      })
    );
  });

  ee.on(eeType.Reply, (data) => {
    socket.send(
      JSON.stringify({
        flash: true,
        type: SocketEventType.NOTIFICATION,
        data,
      })
    );
  });

  ee.on(eeType.like, (data) => {
    socket.send(
      JSON.stringify({
        flash: true,
        type: SocketEventType.NOTIFICATION,
        data,
      })
    );
  });

  console.log('New client connected');
  socket.on('message', async (msg: unknown) => {
    try {
      const evData = JSON.parse(msg as unknown as string) as {
        type: SocketEventType;
        data: Record<string, unknown> & { payload?: Notifications };
        action?:
          | 'read'
          | 'update'
          | 'delete'
          | 'deleteAll'
          | 'add'
          | 'readAll'
          | 'loadAll';
      };

      const { data } = evData;

      if (evData.type === 'notification') {
        switch (evData.action) {
          case 'read': {
            if (typeof data === 'object' && data.id) {
              await prismaClient.notifications.update({
                where: {
                  id: Number(data.id),
                },
                data: {
                  seen: true,
                },
              });
            }
            break;
          }
          case 'update': {
            if (typeof data === 'object' && data.id && data.payload) {
              await prismaClient.notifications.update({
                where: {
                  id: Number(data.id),
                },
                data: {
                  ...data.payload,
                },
              });
            }
            break;
          }
          case 'delete': {
            if (typeof data === 'object' && data.id) {
              await prismaClient.notifications.delete({
                where: {
                  id: Number(data.id),
                },
              });
            }
            break;
          }
          case 'deleteAll': {
            await prismaClient.notifications.deleteMany({
              where: {
                userId: Number(data.user),
              },
            });
            break;
          }
          case 'add': {
            if (typeof data === 'object' && data.userId) {
              const notification = await prismaClient.notifications.create({
                data: {
                  userId: Number(data.userId),
                  content: data.content as string,
                  title: data.title as string,
                  type: data.type as NotificationType,
                },
              });
              ee.emit(
                notification.type,
                JSON.stringify({
                  title: notification.title,
                  content: notification.content,
                })
              );
            }
            break;
          }
          case 'readAll': {
            await prismaClient.notifications.updateMany({
              where: {
                seen: false,
                userId: Number(data.user),
              },
              data: {
                seen: true,
              },
            });
            break;
          }

          case 'loadAll': {
            const notifications = await prismaClient.notifications.findMany({
              where: {
                userId: Number(data.user),
              },
              orderBy: {
                createdAt: 'desc',
              },
            });
            const notificationsUpdates = notifications.map((notification) => ({
              ...notification,
              time: getTimeElapsed(notification.createdAt),
            }));
            socket.send(
              JSON.stringify({
                type: SocketEventType.NOTIFICATION,
                data: {
                  notifications: notificationsUpdates,
                },
              })
            );
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      if (typeof msg !== 'object') {
        logger.error(`invalid message received from socket server: ${msg}`);
      }
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

// routes...

// server.setNotFoundHandler((req, res) => {
//   res.view('/src/views/404.ejs');
// });
server.get('/auth/token', async (req, res, next) => {
  try {
    if (
      req.session.Auth &&
      req.session.Auth.isSuperUser &&
      req.session.SuperUser
    ) {
      res.json({ token: req.session.SuperUser.token });
      return next();
    }

    const userId = req.session?.Auth?.authenticated
      ? req.session?.Auth?.login
      : null;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return next();
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        token: true,
      },
    });

    if (user) {
      res.json({ token: user.token });
      return next();
    } else {
      res.status(404).json({ error: 'Not Found' });
      return next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    return next();
  }
});
server.post('/home', homeController);
server.get('/home', home);
server.get('/api/token', async (req, res) => {
  const { generator, email, url }: ReqParams = req.query;
  if (!generator) {
    res.status(400).send('No generator found');
    return;
  }
  const tokenChecked = await prismaClient.generatorData.findUnique({
    where: {
      name: generator.toLowerCase(),
    },
  });
  if (tokenChecked) {
    res.send(JSON.stringify({ tokenError: 'Invalid token Attribute' }));
  }
  const newTokenHandler = await prismaClient.generatorData.create({
    data: {
      name: generator.toLowerCase(),
      email: email,
      url: url,
    },
  });
  console.log(newTokenHandler);
  const token = tokenGenerator(generator);
  res.send(JSON.stringify({ token }));
});

// Pages...
server.get('/blog', blog);
server.get('/projects', projects);
server.get('/hub', meta);
server.get('/contact', contact);
server.get('/terms', terms);
server.get('/conditions', conditions);
server.get('/FAQ', FAQ);
server.get('/privacy', policy);
server.get('/license', license);
server.get('/about', about);
server.get('/billing', billing);
server.get('/poster/docs', documentView);
server.get('/poster/parser', conversionView);
server.get('/promotion', (_req, res) => {
  res.render('/components/promotion', {
    auth: undefined,
    service: 'promotion',
  });
});
server.get('/404', (_req, res) => {
  res.render('404');
});
// Admin conn
server.post('/articlePost', articlePost);
server.post('/projectPost', projectPost);
server.post('/assetsPost', assetPoster);

// API
// server.get('/test', testRoute);
server.get('/signin', connexion);
server.get('/register', registrationView);
server.post('/api/v1/register', registrationController);
server.post('/api/v1/auth', authController);
server.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
server.get(
  '/login/federated/google',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleAuth
);
server.get('/service', serviceHome);
server.get('/poster/new', poster);
server.get('/poster/update/:post', updateDocView);
server.post('/poster/save', docSaver);
server.get('/poster/view', docView);
server.get('/poster/load/:uid', loadPost);
server.get('/cvMaker', cv);
server.post('/api/v1/parser', parserRoute);
server.post('/user/profile/file', updateProfile);
server.get('/user/exists/:username', checkIfUserExist);
server.post('/user/update', updateUserName);
server.get('/staticFile/:file', serveStatic);
server.get('/downloader/:file', downloader);
server.post('/cv/process', processCV);
server.get('/cv/processApi', cvProcessAPI);
server.get('/cv/:cv', getCV);
server.get('/cv/theme/:uid', getCVTheme);
server.get('/cv/job/status', checkCVStatus);
server.post('/api/v1/poster/parser', parserController);
server.post('/comment/post', comment);
server.get('/find', find);
server.get('/feed/:id', feed);
server.post('/feed/reaction', reactions);
server.get('/webfonts/:file', webfont);
server.get('/translate', translator);

// Plateform bin
server.get('/api/webhooks', webhooks);
server.post('/api/store', store);
server.post('/api/notifications', notifications);
server.get('/disconnection', disconnection);

// Components...
server.get('/components/poster', requestComponent);
server.get('/components/list', requestListComponent);
server.get('/components/head', requestHeadComponent);

// 404 Not found route
server.use((req, res) => {
  if (req.headers['x-api-key']) {
    res.status(404).json({ message: 'Route not found' });
    return;
  }

  res.status(404).render('404');
});

const port = 3085;
server.listen(port, '0.0.0.0', async () => {
  console.log(`Server listening at port: ${port}`);

  // Exécution des tâches une fois le serveur démarré
  try {
    ee.emit('evrymorningAndNyTask', 'beginning the task...');

    // Charger les clés et configurer les tokens
    await setUp(tokenGenerator);

    // Attendre les événements émis et les loguer
    for await (const event of on(ee, 'evrymorningAndNyTask')) {
      console.log(event);
    }
  } catch (err) {
    console.error('Error during setup:', err);
  }
});

// events...

server.on('downloader', (app) => {
  console.log('Download');
  console.log(app);
  console.log(server.request.session);
});

server.on('reversion', (app) => {
  console.log('reversion', app);
});

// workers

export const cvQueue = new Queue<{
  url: string;
  id: number;
  updating?: boolean;
  docId?: number;
}>('cv-processor', 'redis://127.0.0.1:6379');

export const statsQueue = new Queue<string>(
  'stats-saver',
  'redis://127.0.0.1:6379'
);

export const NotificationQueue = new Queue<{
  userId: number;
  type: NotificationType;
  payload: Record<string | number | symbol, unknown>;
}>('notifications', 'redis://127.0.0.1:6379');

cvQueue.process(async (job, done) => {
  try {
    const downLoaderData = await cvDownloader(job.data);
    done(null, downLoaderData);
  } catch (e) {
    done(e as Error);
  }
});

statsQueue.process(async (job, done) => {
  try {
    await stats(job.data);
    done(null);
  } catch (err) {
    done(err as Error);
  }
});

// Events

ee.on('data', (args) => {
  console.log(`event emited from 'data' with ${args}`);
});

ee.on('stat', onStat);
