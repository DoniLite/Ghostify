import { decrypt } from "../utils";
import { prismaClient } from "../config/db";
import { RouteHandlerMethod } from "fastify";

export const home: RouteHandlerMethod = async (req, res) => {
  // const value = await client.hGetAll("Weather");
  // const quote = await client.hGetAll("Quote");
  // console.log(value);
  const connection_time = req.cookies["connection_time"]
  if (!connection_time || Number(decrypt(connection_time, req.session.ServerKeys.secretKey, req.session.ServerKeys.iv)) < Date.now()) {
    return res.redirect('/');
  }
  const Theme = req.session.Theme;
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
    theme: Theme,
  });
};
