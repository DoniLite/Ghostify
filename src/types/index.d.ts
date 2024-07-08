import { ActorBuildOptions, ActorCallOptions, ActorLastRunOptions, ActorStartOptions, Build, BuildCollectionClient, DatasetClient, RunClient, RunCollectionClient, StoreCollectionClient } from "apify-client";
import { ActorVersionClient } from "apify-client/dist/resource_clients/actor_version";
import {
  FastifyReply,
  FastifyRequest,
  FastifyTypeProvider,
} from "fastify";

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
  id: string;
  content: string;
  originator: {
    id: number;
    language_code: string;
    description?: string;
    master_id: number;
    name: string;
    url: string;
  };
  language_code: string;
  url: string;
  tags: string[];
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

export interface CrawlerClient {

  runActorsAndGetOutputs<T>(input: CrawlerInput, runtimeOptions?: RuntimeOptions): Promise<T[]>;

  run<T>(input: CrawlerInput, runOptions?: RunOptions): Promise<T[]>;

  crawlerBuilder(versionNumber: string, options?: ActorBuildOptions): Promise<Build>

  getLastRunClient(options?: ActorLastRunOptions): RunClient;

  getBuildsCollection(): BuildCollectionClient;

  getRunsCollection(): RunCollectionClient;

  getVersionClient(versionNumber: string): ActorVersionClient;

  getDataset<T extends keyof unknown>(): Promise<Dataset<T>>;

}

export type Dataset<T extends keyof unknown> = {
  data: T;
  dataSetClient?: DatasetClient<T>;
};
export interface RunOptions extends ActorStartOptions {

}

export interface RuntimeOptions extends ActorCallOptions {
  iterateToConsole?: boolean;
}

export type CrawlerOutPuts<T extends keyof unknown> = Record<string | number, T>

export interface CrawlerInput {
  startUrls: {
    url: string;
  }[];
  maxRequestsPerCrawl: number;
}

export interface BodyData  {
  data?: {
    country_capital: string;
    country_flag: string;
  };
}

export interface ReqParams {
  generator?: string;
  email?: string;
  url?: string;
}
