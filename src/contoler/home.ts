import { Quote, EssentialWeatherData, WeatherData } from "../index";
import { client } from "../config/db";
import { RouteHandlerMethod } from "fastify";

export const homeControler: RouteHandlerMethod = async (req, res) => {
  const url = "https://quotes15.p.rapidapi.com/quotes/random/?language_code=fr";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "a99ad72beemsh9ee10723dabbfc3p1fc57cjsn26e34074a217",
      "x-rapidapi-host": "quotes15.p.rapidapi.com",
    },
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const quote: Quote = await response.json();
  console.log(`"${quote.content}" —${quote.originator.name}`);
  client.hSet("Quote", {
    _id: quote.id,
    content: quote.content,
    author: quote.originator.name,
  });

  function extractEssentialWeatherData(
    data: WeatherData
  ): EssentialWeatherData {
    const { datetime, tempmax, tempmin, conditions, description, icon } = data;
    return { datetime, tempmax, tempmin, conditions, description, icon };
  }
  type BodyData = {
    data?: {
      country_capital: string;
      country_flag: string;
    };
  };
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
  client.hSet("Weather", {
    ...extractEssentialWeatherData(weather),
    flag: flag,
  });
  return res.send(JSON.stringify({ url: "/home" }));
};
