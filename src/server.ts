import fastify from "fastify";
import view from "@fastify/view";
import ejs from "ejs";
import staticPlugin from "@fastify/static";
import fromBody from "@fastify/formbody";
import session from "@fastify/session";
import fastifyCookie from "@fastify/cookie";
import path from "node:path";

const server = fastify();
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

server.get("/", async (req, res) => {
  return res.view("/src/views/loader.ejs", { pagination: 0, activeIndex: 0 });
});
server.post("/home", async (req, res) => {
  type BodyData = {
    data?: {
      country_capital: string;
    };
  };
  const bodyData: BodyData = req.body;
  const {data} = bodyData;
  const userTown = data.country_capital;
  console.log(bodyData.data);
  const WeatherResponse = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userTown}?unitGroup=us&key=FLJ2SXSD4HVS6KL7Z6KFGCH8Y&contentType=json`
  );
  const weatherData = await WeatherResponse.json();
  console.log(weatherData);
  req.session.get(req.session.Weather)
  return res.send(JSON.stringify({url: '/home'}));
});
server.get("/home", async (req, res) => {
  console.log(req.session.Weather)
  return res.view("/src/views/index.ejs", { pagination: 1, activeIndex: 0 });
});

server.listen({ port: 3080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  console.log(__dirname);
});
