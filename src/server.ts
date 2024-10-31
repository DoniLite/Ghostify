'use strict';
import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookie from 'cookie-parser';
import { prismaClient } from './config/db';
import { ReqParams } from './@types';
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
import { blog } from './routes/blog';
import { on, EventEmitter } from 'node:events';
import {
  authController,
  connexion,
  disconnection,
  getMd,
  getMdScript,
  googleAuth,
  parserRoute,
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
import { cv } from './controller/cv';
import { uploadActu } from './controller/actu';
import { assetPoster } from './controller/assetsPost';
// import fastifyRedis from '@fastify/redis';
// import RedisStore from 'connect-redis';
import { setUp } from './hooks/setup';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// import { stats } from './hooks/statCounter';
import { veriry } from './hooks/verify';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import i18n from 'i18n';
import sql3 from 'connect-sqlite3';
import { redirector } from './hooks/redirector';
import { projects } from './routes/project';
import { meta } from './routes/meta';
import { contact } from './routes/contact';
import { apiGaming } from './routes/APIs';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { test as testRoute } from './routes/test';
import expressWs from 'express-ws';
import { checkIfUserExist, updateProfile, updateUserName } from './routes/user';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
      callbackURL:
        process.env.NODE_ENV === 'production'
          ? 'https://ghostify.site/login/federated/google'
          : 'http://localhost:3085/login/federated/google',
      scope: ['profile'],
      state: true,
    },
    async (accessToken, refreshToken, profile, cb) => {
      const verifEmail = profile._json.email
      const picture = profile._json.picture;
      const userId = profile.id;
      if (!verifEmail) {
        const error = new Error('User not authenticated');
        cb(error, null);
        return;
      }
      try {
        const checkExistedUser = await prismaClient.user.findUnique({
          where: { email: verifEmail },
        });
        if (checkExistedUser && checkExistedUser.providerId !== userId) {
          const error = new Error(
            `User ${profile.emails[0].value} already exists`
          );
          cb(error, null);
          return;
        }
        if(checkExistedUser && checkExistedUser.providerId === userId) {
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
          },
        });
        cb(null, newUser.id);
      } catch (err) {
        cb(err, null);
      }
    }
  )
);

passport.serializeUser((userId, done) => {
  process.nextTick(function() {
    done(null, userId);
  })
});

passport.deserializeUser((userId, done) => {
  process.nextTick(async function() {
    try {
      const user = await prismaClient.user.findUnique({
        where: { providerId: String(userId) },
      });
      return done(null, user);
    } catch (err) {
      done(err, null);
    }
  })
});

i18n.configure({
  locales: ['en', 'fr', 'es'], // Liste des langues supportées
  directory: path.resolve(__dirname, '../locales'), // Répertoire où se trouvent les fichiers de traduction
  defaultLocale: 'fr', // Langue par défaut
});

// export const Store = new RedisStore({
//   client: process.env.NODE_ENV === 'production' ? client : redisStoreClient,
// });

const SQLStore = sql3(session);

export const ee = new EventEmitter();

dotEnv.config();
const server = express();
expressWs(server);
// const socketUrl =
//   process.env.NODE_ENV !== 'production'
//     ? 'ws://localhost/notifications'
//     : 'ws://ghostify.site/notifications';
server.engine('html', ejs.renderFile);
server.set('view engine', 'ejs');
// {logger: true}

// Hooks...

// server.addHook('onResponse', stats);

export const tokenGenerator = (payload: string, opt?: SignOptions) => {
  if (opt) return jwt.sign(payload, process.env.JWT_SECRET, opt);
  return jwt.sign(payload, process.env.JWT_SECRET);
};

server.use(i18n.init);

// Détecter la langue via les paramètres de requête
server.use((req, res, next) => {
  const lang = (req.query.lang as string) || 'fr'; // Par défaut 'en' si la langue n'est pas spécifiée
  res.setLocale(lang);
  next();
});

server.use(
  rateLimit({
    max: 100,
  })
);

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
server.use((req, res, next) => {
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
          (req: express.Request, res: express.Response) =>
            `'nonce-${res.locals.cspNonce}'`,
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
        connectSrc: [
          "'self'", 'ws://localhost:3085', 'wss://0.0.0.0:3085', 'ws://ghostify.site', 'wss://ghostify.site',
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
  express.static(path.resolve(__dirname, '../src/public'), {
    maxAge: '1d', // Définit une durée de vie du cache de 1 jour
    etag: false, // Désactive les ETags (facultatif)
    setHeaders:
      process.env.NODE_ENV !== 'production'
        ? null
        : (res) => {
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 86400 secondes = 1 jour
          },
  })
);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookie(process.env.SESSION_SECRET));
const sessionStorePath =
  process.env.NODE_ENV === 'production'
    ? path.resolve('/home/ubuntu/Ghostify/sessions')
    : path.resolve(__dirname, '../src/config');

// Assurez-vous que le dossier existe
fs.mkdirSync(path.dirname(sessionStorePath), { recursive: true });

server.use(
  session({
    secret: process.env.SESSION_SECRET,
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
  })
);

server.use(passport.initialize());
server.use(passport.authenticate('session'));
server.use(passport.session());

server.use(sessionStorageHook);
// server.use(stats);
server.use(veriry);
server.use(redirector);
server.on('reversion', (app) => {
  console.log('reversion', app);
});


// Websocket routes
server.ws('/', (socket) => {
  console.log('New client connected');
  socket.on('message', (msg) => {
    console.log('Received:', msg);
    socket.send('Hello from server');
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });

})


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
server.get('/blog', blog);
server.get('/projects', projects);
server.get('/hub', meta);
server.get('/contact', contact);
server.get('/api-gaming', apiGaming);
server.get('/terms', terms);
server.get('/conditions', conditions);
server.get('/FAQ', FAQ);
server.get('/privacy', policy);
server.get('/license', license);
server.get('/about', about);
server.get('/promotion', (req, res) => {
  res.render('components/promotion', { auth: undefined, service: 'promotion' });
});

// Admin conn
server.post('/articlePost', articlePost);
server.post('/projectPost', projectPost);
server.post('/assetsPost', assetPoster);

// API
server.get('/test', testRoute);
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
server.post('/poster/save', docSaver);
server.get('/poster/view', docView);
server.post('/actu/post', uploadActu);
server.get('/cvMaker', cv);
server.post('/api/v1/parser', parserRoute);
server.get('/api/v1/md.css', getMd);
server.get('/api/v1/md.js', getMdScript);
server.get('/login/federated/google');
server.post('/user/profile/file', updateProfile)
server.get('/user/exists/:username', checkIfUserExist);
server.post('/user/update', updateUserName);

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

const port = parseInt(process.env.PORT) || 3085;
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


