import {
  Quote,
  EssentialWeatherData,
  WeatherData,
  BodyData,
} from '../@types/index';
// import { client } from "../config/db";
import { FastifyRequest, RouteHandlerMethod } from 'fastify';
import { encrypt, extractEssentialWeatherData, reduceQuote } from '../utils';
import { WebSocket } from '@fastify/websocket';

const X_RAPID_KEY = process.env.X_RAPID_KEY;
const X_RAPID_HOST = process.env.X_RAPID_HOST;

export const homeControler: RouteHandlerMethod = async (req, res) => {
  const bodyData: BodyData = req.body;
  const { data } = bodyData;
  const userTown = data.country_capital;
  const flag = data.country_flag;
  const api = await apiRequester(userTown);
  if (api === false) {
    return res.send(JSON.stringify({ url: '/home?noApiData=true' }));
  }
  const quote: Quote = await api[0].json();
  // console.log(`"${quote.content}" —${quote.originator.name}`);
  const sessionQuote = {
    id: quote.id,
    content: reduceQuote(quote.content),
    author: quote.originator.name,
  };
  const weatherData = await api[1].json();
  const weather: WeatherData = weatherData.days[0];
  const finalWeatherData = {
    ...extractEssentialWeatherData(weather),
    flag: flag,
    city: userTown,
  };
  req.session.Weather = finalWeatherData;
  req.session.Quote = sessionQuote;
  await req.session.save();
  return res.send(JSON.stringify({ url: '/home' }));
};

const apiRequester = async (town: string) => {
  try {
    const url =
      'https://quotes15.p.rapidapi.com/quotes/random/?language_code=fr';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': X_RAPID_KEY,
        'x-rapidapi-host': X_RAPID_HOST,
      },
    };
    const res = await Promise.all([
      fetch(url, options),
      fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${town}?unitGroup=metric&key=FLJ2SXSD4HVS6KL7Z6KFGCH8Y&contentType=json`
      ),
    ]);
    return res;
  } catch (err) {
    return false;
  }
};
