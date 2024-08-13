import { RouteHandlerMethod } from "fastify";
import { encrypt } from "../utils";
import { prismaClient } from "../config/db";
import { EssentialWeatherData, SessionQuote } from "index";
export const index: RouteHandlerMethod = async (req, res) => {
  const cookieExpriration = new Date();
  cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
  res.code(200);
  req.session.Token = encrypt(Date.now().toString());
  res.setCookie("connection_time", encrypt(Date.now().toString()), {
    expires: cookieExpriration,
  });
  const loaderCookie = req.cookies["ghostify_home_session"];
  if (!loaderCookie) {
    return res.view("/src/views/loader.ejs", {
      pagination: 0,
      activeIndex: 0,
    });
  };
  const cookieObj = JSON.parse(loaderCookie) as {weather: EssentialWeatherData, quote: SessionQuote};
  const urls = await prismaClient.url.findMany({
    orderBy: {
      visit: "desc",
    },
    take: 10,
  });
  const projects = await prismaClient.project.findMany();
  const posts = await prismaClient.post.findMany();
    return res.view("/src/views/index.ejs", {
      pagination: 1,
      activeIndex: 0,
      weatherData: cookieObj.weather,
      quote: cookieObj.quote,
      projects,
      posts,
      urls,
    });
};
