import fastify from "fastify";
import view from "@fastify/view";
import ejs from "ejs";
import staticPlugin from "@fastify/static";
import fromBody from "@fastify/formbody";
import session from "@fastify/session";
import fastifyCookie from "@fastify/cookie";
import path from "node:path";
import { client } from "./config/db";
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
  interface WeatherData {
    datetime: string;
    datetimeEpoch: number;
    tempmax: number;
    tempmin: number;
    temp: number;
    feelslikemax: number;
    feelslikemin: number;
    feelslike: number;
    dew: number;
    humidity: number;
    precip: number;
    precipprob: number;
    precipcover: number;
    preciptype: any[];
    snow: number;
    snowdepth: number;
    windgust: number;
    windspeed: number;
    winddir: number;
    pressure: number;
    cloudcover: number;
    visibility: number;
    solarradiation: number;
    solarenergy: number;
    uvindex: number;
    severerisk: number;
    sunrise: string;
    sunriseEpoch: number;
    sunset: string;
    sunsetEpoch: number;
    moonphase: number;
    conditions: string;
    description: string;
    icon: string;
    stations: any;
    source: string;
    hours: any[];
  }

  interface EssentialWeatherData {
    datetime: string;
    tempmax: number;
    tempmin: number;
    conditions: string;
    description: string;
  }

  function extractEssentialWeatherData(
    data: WeatherData
  ): EssentialWeatherData {
    const { datetime, tempmax, tempmin, conditions, description } = data;
    return { datetime, tempmax, tempmin, conditions, description };
  }
  type BodyData = {
    data?: {
      country_capital: string;
    };
  };
  const bodyData: BodyData = req.body;
  const { data } = bodyData;
  const userTown = data.country_capital;
  console.log(bodyData.data);
  const WeatherResponse = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userTown}?unitGroup=us&key=FLJ2SXSD4HVS6KL7Z6KFGCH8Y&contentType=json`
  );
  const weatherData = await WeatherResponse.json();
  const weather: WeatherData = weatherData.days[0];
  console.log(weather);
  client.hSet("Weather", {...extractEssentialWeatherData(weather)});
  return res.send(JSON.stringify({ url: "/home" }));
});
server.get("/home", async (req, res) => {
  const value = await client.hGetAll("Weather");
  console.log(JSON.stringify(value, null, 2));
  console.log(value);
  return res.view("/src/views/index.ejs", { pagination: 1, activeIndex: 0, weatherData: value });
});

server.listen({ port: 3080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  console.log(__dirname);
});
