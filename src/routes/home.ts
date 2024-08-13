import { prismaClient } from "../config/db";
import { RouteHandlerMethod } from "fastify";

export const home: RouteHandlerMethod = async (req, res) => {
  // const value = await client.hGetAll("Weather");
  // const quote = await client.hGetAll("Quote");
  // console.log(value);
  const urls = await prismaClient.url.findMany({
    orderBy: {
      visit: "desc",
    },
    take: 10,
  });
  const projects = await prismaClient.project.findMany();
  const posts = await prismaClient.post.findMany();
  const weather = req.session.Weather;
  const quote = req.session.Quote;
  const cookieObj = {
    weather: weather,
    quote: quote,
  };
  const cookieExpiration = new Date();
  cookieExpiration.setMinutes(cookieExpiration.getMinutes() + 15);
  const cookie = JSON.stringify(cookieObj);
  res.setCookie("ghostify_home_session", cookie, { expires: cookieExpiration });
  console.log(quote, weather);
  return res.view("/src/views/index.ejs", {
    pagination: 1,
    activeIndex: 0,
    weatherData: weather,
    quote: quote,
    projects,
    posts,
    urls,
  });
};
