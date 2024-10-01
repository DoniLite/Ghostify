'use strict';
import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookie from 'cookie-parser';
import { prismaClient, redisStoreClient } from './config/db';
import { ReqParams } from './@types';
import { index } from './routes';
import cors from 'cors';
import { home } from './routes/home';
import { homeControler } from './controller/home';
import dotEnv from 'dotenv';
import { siteUrls } from './controller/siteUrls';
import jwt, { SignOptions } from 'jsonwebtoken';
import { store } from './controller/store';
import { notifications } from './controller/notifications';
import { webhooks } from './controller/webhooks';
import { sessionStorageHook } from './hooks/sessionStorage';
import {
  about,
  conditions,
  FAQ,
  license,
  policy,
  terms,
} from './routes/assets';
// import { stats } from './hooks/statCounter';
import { articlePost } from './controller/articlePost';
import { projectPost } from './controller/projectPost';
import { article } from './routes/blog';
import { on, EventEmitter } from 'node:events';
import { loadKeys } from './utils';
import {
  authController,
  connexion,
  disconnection,
  registrationController,
  registrationView,
  serviceHome,
} from './controller/api.v1';
import { urlVisitor } from './controller/pushVisitor';
import {
  docSaver,
  docView,
  poster,
  requestComponent,
  requestListComponent,
} from './routes/poster';
import { find } from './controller/finder';
import ws from 'ws';
import { cv } from './controller/cv';
// import { uploadActu } from './controller/actu';
import { assetPoster } from './controller/assetsPost';
// import fastifyRedis from '@fastify/redis';
import RedisStore from 'connect-redis';
import { setUp } from './hooks/setup';
// import helmet from '@fastify/helmet';
import rateLimit from 'express-rate-limit';
// import { stats } from './hooks/statCounter';
import { veriry } from './hooks/verify';
// import fs from 'node:fs';
import path from 'node:path';
// import crypto from 'node:crypto';
// import multer from 'fastify-multer';

const Store = new RedisStore({
  client: redisStoreClient,
});

export const ee = new EventEmitter();

dotEnv.config();
const server = express();
// const socketUrl =
//   process.env.NODE_ENV !== 'production'
//     ? 'ws://localhost/notifications'
//     : 'ws://ghostify.site/notifications';
const wss = new ws.Server({
  port: 8080,
  path: '/notifications',
});
wss.on('connection', (ws, req) => {
  console.log(req);
});
wss.on('error', (err) => {
  console.error(err);
});
export const router = express.Router();
server.engine('html', ejs.renderFile);
server.set('view engine', 'ejs');
// {logger: true}

// Hooks...

// server.addHook('onResponse', stats);

export const tokenGenerator = (payload: string, opt?: SignOptions) => {
  if (opt) return jwt.sign(payload, process.env.JWT_SECRET, opt);
  return jwt.sign(payload, process.env.JWT_SECRET);
};

server.use(
  rateLimit({
    max: 100,
  })
);
server.use(
  cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST'],
    credentials: true,
  })
);
server.use(
  '/static',
  express.static(path.resolve(__dirname, '../src/public'), {
    maxAge: '1d', // Définit une durée de vie du cache de 1 jour
    etag: false, // Désactive les ETags (facultatif)
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 86400 secondes = 1 jour
    },
  })
);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookie(process.env.SESSION_SECRET));
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: 'auto', // true in production for HTTPS
    },
    name: 'sessionId',
    store: Store,
    saveUninitialized: false,
    resave: false,
  })
);

server.use(sessionStorageHook);
// server.use(stats);
server.use(veriry);

// routes...

// server.setNotFoundHandler((req, res) => {
//   res.view('/src/views/404.ejs');
// });
router.get('/auth/token', async (req, res, next) => {
  try {
    if (
      req.session.Auth &&
      req.session.Auth.isSuperUser &&
      req.session.SuperUser
    ) {
      res.json({ token: req.session.SuperUser.token });
      return next();
    }

    const userId = req.session.Auth ? req.session.Auth.login : null;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return next();
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: Number(userId),
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
server.get('/test', (req, res) => {
  // console.log(req);
  res.render('test');
})
server.get('/', index);
server.post('/home', homeControler);
server.get('/home', home);
server.post('/sitesUpload', siteUrls);
server.get('/api/token', async (req, res) => {
  const { generator, email, url }: ReqParams = req.query;
  if (!generator) {
    res.status(404).send('No generator found');
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
server.get('/article', article);
server.get('/terms', terms);
server.get('/conditions', conditions);
server.get('/FAQ', FAQ);
server.get('/privacy', policy);
server.get('/license', license);
server.get('/about', about);

// Admin conn
server.post('/articlePost', articlePost);
server.post('/projectPost', projectPost);
server.post('/assetsPost', assetPoster);

// API
server.get('/signin', connexion);
server.get('/register', registrationView);
server.post('/api/v1/register', registrationController);
server.post('/api/v1/auth', authController);
server.get('/service', serviceHome);
server.get('/poster/new', poster);
server.post('/poster/save', docSaver);
server.get('/poster/view', docView);
// server.post('/actu/post', uploadActu);
server.get('/cvMaker', cv);


// Plateform bin
server.get('/api/webhooks', webhooks);
server.post('/api/store', store);
server.post('/api/notifications', notifications);
server.get('/disconnection', disconnection);

// Components...
server.get('/components/poster', requestComponent);
server.get('/components/list', requestListComponent);

// features and other thread specific
server.get('/update/visitor', urlVisitor);
server.get('/find', find);
server.get('/feed', (req, res) => {
  return res.render('src/views/components/feed.ejs', { service: undefined });
});

const port = parseInt(process.env.PORT) || 3081;
server.listen(port, '0.0.0.0', async () => {
  console.log(`Server listening at port: ${port}`);

  // Exécution des tâches une fois le serveur démarré
  try {
    ee.emit('evrymorningAndNyTask', 'beginning the task...');

    // Charger les clés et configurer les tokens
    const keys = await loadKeys();
    await setUp(keys.secretKey, keys.iv, tokenGenerator);

    // Attendre les événements émis et les loguer
    for await (const event of on(ee, 'evrymorningAndNyTask')) {
      console.log(event);
    }
  } catch (err) {
    console.error('Error during setup:', err);
  }
});
