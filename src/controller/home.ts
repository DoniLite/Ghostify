import { Quote, EssentialWeatherData, WeatherData, BodyData } from "../types/index";
import { client } from "../config/db";
import { RouteHandlerMethod } from "fastify";
import { extractEssentialWeatherData, reduceQuote } from "../utils";

const X_RAPID_KEY  = process.env.X_RAPID_KEY
const X_RAPID_HOST = process.env.X_RAPID_HOST

export const homeControler: RouteHandlerMethod = async (req, res) => {
  const url = "https://quotes15.p.rapidapi.com/quotes/random/?language_code=fr";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": X_RAPID_KEY,
      "x-rapidapi-host": X_RAPID_HOST,
    },
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const quote: Quote = await response.json();
  // console.log(`"${quote.content}" —${quote.originator.name}`);
  const sessionQuote  = {
    id: quote.id,
    content: reduceQuote(quote.content),
    author: quote.originator.name,
  }
  // client.hSet("Quote", {
  //   _id: quote.id,
  //   content: quote.content,
  //   author: quote.originator.name,
  // });
  const bodyData: BodyData = req.body;
  const { data } = bodyData;
  const userTown = data.country_capital;
  const flag = data.country_flag;
  const WeatherResponse = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userTown}?unitGroup=metric&key=FLJ2SXSD4HVS6KL7Z6KFGCH8Y&contentType=json`
  );
  if(!WeatherResponse.ok){
    throw new Error(WeatherResponse.statusText);
  }
  const weatherData = await WeatherResponse.json();
  const weather: WeatherData = weatherData.days[0];
  const finalWeatherData = {
    ...extractEssentialWeatherData(weather),
    flag: flag,
    city: userTown,
  };
  // req.session.set("Weather", {
  //   ...finalWeatherData
  // })
  // req.session.set("Quote", {
  //   ...sessionQuote
  // })
  req.session.Weather = finalWeatherData;
  req.session.Quote = sessionQuote;
  // await req.setSession(finalWeatherData, 'Weather')
  // await req.setSession(sessionQuote, 'Quote')
  await req.session.save();
  return res.send(JSON.stringify({ url: "/home" }));
};
