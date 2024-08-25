import { decrypt, encrypt } from "../utils";
import { prismaClient } from "../config/db";
import { RouteHandlerMethod } from "fastify";
import { EssentialWeatherData, QueryXData, SessionQuote } from "index";

export const home: RouteHandlerMethod = async (req, res) => {
  // const value = await client.hGetAll("Weather");
  // const quote = await client.hGetAll("Quote");
  // console.log(value);
  // const connection_time = req.cookies["connection_time"]
  // if (!connection_time || Number(decrypt(req.session.Token, req.session.ServerKeys.secretKey, req.session.ServerKeys.iv)) < Date.now()) {
  //   return res.redirect('/');
  // }
  const {persisted, noApiData} = req.query as QueryXData<{persisted: boolean; noApiData: boolean;}>;
  const loaderCookie = req.cookies['ghostify_home_session'];
  const Theme = req.session.Theme;
  if (persisted){
    const cookieObj = JSON.parse(loaderCookie) as {
      weather: EssentialWeatherData;
      quote: SessionQuote;
    };
    const urls = await prismaClient.url.findMany({
      orderBy: {
        visit: 'desc',
      },
      take: 10,
    });
    const projects = await prismaClient.project.findMany();
    const posts = await prismaClient.post.findMany();
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    req.session.Token = encrypt(
      Date.now().toString(),
      req.session.ServerKeys.secretKey,
      req.session.ServerKeys.iv
    );
    res.setCookie('connection_time', req.session.Token, {
      expires: cookieExpriration,
    });
    return res.view('/src/views/index.ejs', {
      pagination: 1,
      activeIndex: 0,
      weatherData: cookieObj.weather,
      quote: cookieObj.quote,
      projects,
      posts,
      urls,
      theme: Theme,
    });
  };
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
  if(noApiData) {
    return res.view('/src/views/index.ejs', {
      pagination: 1,
      activeIndex: 0,
      projects,
      posts,
      urls,
      theme: Theme,
    });
  }
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
