import { Quote, EssentialWeatherData, WeatherData } from "../index";
import { client } from "../config/db";
import { RouteHandlerMethod } from "fastify";

export const homeControler: RouteHandlerMethod = async (req, res) => {
  async function fetchRandomQuote(): Promise<Quote> {
    const response = await fetch("https://api.quotable.io/random");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Quote = await response.json();
    console.log(`"${data.content}" —${data.author}`);
    return data;
  }
  const quote = await fetchRandomQuote();
  client.hSet("Quote", {
    _id: quote._id,
    content: quote.content,
    author: quote.author,
    authorSlug: quote.authorSlug,
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
  console.log(data);
  const WeatherResponse = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userTown}?unitGroup=metric&key=FLJ2SXSD4HVS6KL7Z6KFGCH8Y&contentType=json`
  );
  const weatherData = await WeatherResponse.json();
  const weather: WeatherData = weatherData.days[0];
  console.log(weatherData);
  client.hSet("Weather", {
    ...extractEssentialWeatherData(weather),
    flag: flag,
  });
  return res.send(JSON.stringify({ url: "/home" }));
};
