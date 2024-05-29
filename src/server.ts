import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import view from "@fastify/view";
import ejs from "ejs";
import staticPlugin from "@fastify/static";
import fromBody from "@fastify/formbody";
import session from "@fastify/session";
import fastifyCookie from "@fastify/cookie";
import path from "node:path";
import { client } from "./config/db";
import { Quote } from "./";
import { index } from "./routes";
import { WeatherData, EssentialWeatherData } from "./";
import cors from "@fastify/cors";
import { home } from "./routes/home";
import { homeControler } from "./contoler/home";


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

server.register(cors, {
  // put your options here
  origin: "*",
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

server.get("/api/", index)

server.get('/blog', (req, res) => {
  return res.view("/src/views/blogOne.ejs", { pagination: 1, activeIndex: 3 });
})

const port = parseInt(process.env.PORT) || 3081;
server.listen({ port: port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
