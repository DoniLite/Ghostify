import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import view from "@fastify/view";
import ejs from "ejs";
import staticPlugin from "@fastify/static";
import fromBody from "@fastify/formbody";
import session from "@fastify/session";
import fastifyCookie from "@fastify/cookie";
import path from "node:path";
import { prismaClient } from "./config/db";
import { ReqParams } from "./types";
import { index } from "./routes";
import cors from "@fastify/cors";
import { home } from "./routes/home";
import { homeControler } from "./controller/home";
import { blog } from "./routes/blog";
import dotEnv from "dotenv"
import { siteUrls } from "./controller/siteUrls";
import fastifyJwt from "@fastify/jwt";
import { store } from "./controller/store";
import { notifications } from "./controller/notifications";
import { webhooks } from "./controller/webhooks";
import { sessionStorageHook } from "./hooks/sessionStorage";
import { article } from "./routes/article";
import { about, license, policy, terms } from "./routes/assets";
import { stats } from "./hooks/statCounter";
// import LRU from "lru-cache";

const protectedRoutes = [
  "/api/v1",
  "/api/notifications",
  "/api/store",
  "/api/webhooks",
];
dotEnv.config()
const server : FastifyInstance = fastify();
// ejs.cache = LRU(100);

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
})

// Hooks...
server.addHook("onRequest", async (req, res) => {
  const url = req.raw.url;
  if (protectedRoutes.includes(url)) {
    try {
      await req.jwtVerify();
    } catch (err) {
      if (process.env.NODE_ENV == 'production') {
        res.send({err: "Une erreur s'est produite i se peut que vous ne soyez pas disposé à accéder à ceci"})
      }
      res.send(err);
    }
  }
});
server.addHook('onRequest', stats)
// server.addHook("preHandler", sessionStorageHook)

const tokenGenerator = (payload: string) =>  {
  const token = server.jwt.sign({ payload });
  return token
};

server.register(cors, {
  // put your options here
  origin: "*",
  methods:['GET', 'PUT', 'POST'],
  credentials: true,
  cacheControl: "Cache-Control: ${fully}",
});
server.register(view, {
  engine: {
    ejs: ejs,
  },
});
server.register(staticPlugin, {
  root: path.join(path.resolve(__dirname, ".."), "src/public"),
  prefix: "/static/",
});
server.register(fromBody);
server.register(fastifyCookie);
server.register(session, {
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false, // true in production for HTTPS
  },
  // saveUninitialized: false,
  // cookieName: "sessionId",
});


// routes...
server.setErrorHandler((err, req, res) => {
  server.log.error(err);
  res.view("/src/views/error.ejs");
});
server.setNotFoundHandler((req, res) => {
  res.view("/src/views/404.ejs");
})
server.get("/", index);
server.post("/home", homeControler);
server.get("/home", home);
server.post("/sitesUpload", siteUrls);
server.get('/api/token', async (req, res) => {
  const {generator, email, url}: ReqParams = req.query;
  if(!generator) {
    throw new Error('generator is missing in the query string');
  }
  const tokenChecked = await prismaClient.generatorData.findUnique({
    where: {
      name: generator.toLowerCase(),
    },
  });
  if(tokenChecked) {
    return res.send(JSON.stringify({tokenError: 'Invalid token Attribute'}));
  }
  const newTokenHandler = await prismaClient.generatorData.create({
    data: {
      name: generator.toLowerCase(),
      email: email,
      url: url,
    }
  })
  console.log(newTokenHandler)
  const token = tokenGenerator(generator);
  res.send(JSON.stringify({token}));
})
server.get('/api/webhooks', webhooks)
server.post('/api/store', store)
server.post("/api/notifications", notifications)

server.get('/blog', blog)
server.get('/articles', article)

server.get('/terms', terms)
server.get('/privacy', policy)
server.get('/license', license)
server.get('/about', about)

const port = parseInt(process.env.PORT) || 3081;
server.listen({ port: port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
