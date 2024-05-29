import { Logger } from "concurrently";
import { FastifyInstance, FastifyReply, FastifyRequest, FastifyTypeProvider } from "fastify";
import { ReplyDefault, RequestBodyDefault } from "fastify/types/utils";
import { Server } from "http";


export interface EssentialWeatherData {
  datetime: string;
  tempmax: number;
  tempmin: number;
  conditions: string;
  description: string;
  icon: string;
}


export interface WeatherData {
  datetime: string;
  datetimeEpoch: number;
  tempmax: number;
  tempmin: number;
  temp: number;
  feelslikemax: number;
  feelslikemin: number;
  feelslike: number;
  dew: number;
  humidity: number;
  precip: number;
  precipprob: number;
  precipcover: number;
  preciptype: any[];
  snow: number;
  snowdepth: number;
  windgust: number;
  windspeed: number;
  winddir: number;
  pressure: number;
  cloudcover: number;
  visibility: number;
  solarradiation: number;
  solarenergy: number;
  uvindex: number;
  severerisk: number;
  sunrise: string;
  sunriseEpoch: number;
  sunset: string;
  sunsetEpoch: number;
  moonphase: number;
  conditions: string;
  description: string;
  icon: string;
  stations: any;
  source: string;
  hours: any[];
}

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
}

export interface IQuerystring {
  username?: string;
  password?: string;
}

export interface IHeaders {
  "h-Custom": string;
}

export interface IReply {
  200: FastifyReply;
  302: { url: string };
  "4xx": { error: string };
}

