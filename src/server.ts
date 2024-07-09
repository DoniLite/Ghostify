import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import view from "@fastify/view";
import ejs from "ejs";
import staticPlugin from "@fastify/static";
import fromBody from "@fastify/formbody";
import session from "@fastify/session";
import fastifyCookie from "@fastify/cookie";
import path from "node:path";
import { client, prismaClient } from "./config/db";
import { Quote, ReqParams } from "./types";
import { index } from "./routes";
import { WeatherData, EssentialWeatherData } from "./types";
import cors from "@fastify/cors";
import { home } from "./routes/home";
import { homeControler } from "./contoler/home";
import { blog } from "./routes/blog";
import dotEnv from "dotenv"
import { siteUrls } from "./contoler/siteUrls";
import fastifyJwt from "@fastify/jwt";
import { store } from "./contoler/store";
import { notifications } from "./contoler/notifications";
import { webhooks } from "./contoler/webhooks";

const protectedRoutes = ["/api/v1", "/api/notifications", "/api/store"];
dotEnv.config()
const server : FastifyInstance = fastify();

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          pong: {
            type: "string",
          },
        },
      },
    },
  },
};

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
})

server.addHook("onRequest", async (req, res) => {
  const url = req.raw.url;
  if (protectedRoutes.includes(url)) {
    try {
      await req.jwtVerify();
    } catch (err) {
      res.send(err);
    }
  }
});

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
  secret: "This is the Server of @DoniLiteGhost",
});

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

const port = parseInt(process.env.PORT) || 3081;
server.listen({ port: port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
