import { Quote, EssentialWeatherData, WeatherData } from "../types/index";
import { client } from "../config/db";
import { RouteHandlerMethod } from "fastify";

export const home: RouteHandlerMethod = async (req, res) => {
  const value = await client.hGetAll("Weather");
  const quote = await client.hGetAll("Quote");
  console.log(value);
  return res.view("/src/views/index.ejs", {
    pagination: 1,
    activeIndex: 0,
    weatherData: value,
    quote: quote,
  });
};
