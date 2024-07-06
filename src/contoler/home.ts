import { Quote, EssentialWeatherData, WeatherData, BodyData } from "../index";
import { client } from "../config/db";
import { RouteHandlerMethod } from "fastify";

export const homeControler: RouteHandlerMethod = async (req, res) => {
  const url = "https://quotes15.p.rapidapi.com/quotes/random/?language_code=fr";
  const debordedText = `L'amour naturel veut voir l'être aimé pour soi, et autant que possible le posséder sans partage. Le Christ est venu pour ramener au Père l'humanité égarée; or qui aime de son amour veut les hommes pour Dieu et non pour lui même. Tel est d'ailleurs le plus sûr moyen de le posséder pour toujours, car si nous avons confié un homme à la garde de Dieu, nous sommes en lui un en Dieu; alors que la soif de posséder conduit souvent - en fait tôt ou tard- à tout perdre. Ceci vaut pour l'âme d'autrui comme pour la nôtre, comme pour tout bien extérieur. Qui veut s'enrichir et conserver dans le monde, perdra. Qui abandonne à Dieu, l'emportera`;
  const debordedLength = debordedText.length;
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
