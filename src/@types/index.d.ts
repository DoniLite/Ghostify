import {
  ActorBuildOptions,
  ActorCallOptions,
  ActorLastRunOptions,
  ActorStartOptions,
  Build,
  BuildClient,
  BuildCollectionClient,
  DatasetClient,
  KeyValueClientListKeysOptions,
  KeyValueListItem,
  KeyValueStoreClient,
  PaginatedList,
  RequestQueueClient,
  RequestQueueCollectionClient,
  RequestQueueUserOptions,
  RunClient,
  RunCollectionClient,
  StoreCollectionClient,
} from 'apify-client';
import { ActorVersionClient } from 'apify-client/dist/resource_clients/actor_version';
import { FastifyReply, FastifyRequest, FastifyTypeProvider } from 'fastify';
import sharp from 'sharp';

export interface EssentialWeatherData {
  datetime?: string;
  tempmax?: number;
  tempmin?: number;
  conditions?: string;
  description?: string;
  icon?: string;
  flag?: string;
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

export interface SessionQuote {
  id?: string;
  content?: string;
  author?: string;
}

export interface IQuerystring {
  username?: string;
  password?: string;
}

export interface IHeaders {
  'h-Custom': string;
}

export interface IReply {
  200: FastifyReply;
  302: { url: string };
  '4xx': { error: string };
}

export interface CrawlerClient {
  runActorsAndGetOutputs<T>(
    input: CrawlerInput,
    runtimeOptions?: RuntimeOptions
  ): Promise<T[]>;

  run<T>(input: CrawlerInput, runOptions?: RunOptions): Promise<T[]>;

  crawlerBuilder(
    versionNumber: string,
    options?: ActorBuildOptions
  ): Promise<Builder>;

  getLastRunClient(options?: ActorLastRunOptions): Promise<RunClient>;

  getRequestQueueCollection(): Promise<RequestQueueCollectionClient>;

  getRequestQueue(
    id: string,
    options?: RequestQueueUserOptions
  ): Promise<RequestQueueClient>;

  getBuildsCollection(): Promise<BuildCollectionClient>;

  getRunsCollection(): Promise<RunCollectionClient>;

  getVersionClient(
    actorId: string,
    versionNumber: string
  ): Promise<ActorVersionClient>;

  getDataset<T extends DatasetRecord>(id?: string): Promise<Dataset<T>>;

  getKeyList(
    id: string,
    options?: KeyValueClientListKeysOptions
  ): Promise<KeyValueListItem[]>;

  getStoreValue<T extends keyof unknown>(
    id: string,
    key: string
  ): Promise<StoreValue<T> | undefined>;
}

export type Builder = {
  build: Build;
  buildInstance: BuildClient;
};

export type Dataset<T extends DatasetRecord> = {
  data: T[];
  dataSetClient?: DatasetClient<T>;
};

export type DatasetRecord = {
  [key: string]: string | number | symbol;
};

export type StoreValue<T extends keyof unknown> = {
  data: T;
  storeClient: KeyValueStoreClient;
};
export interface RunOptions extends ActorStartOptions {}

export interface RuntimeOptions extends ActorCallOptions {
  iterateToConsole?: boolean;
}

export type CrawlerOutPuts<T extends keyof unknown> = Record<
  string | number,
  T
>;

export interface CrawlerInput {
  startUrls: {
    url: string;
    name: string;
  }[];
  maxRequestsPerCrawl: number;
}

export type BodyXData<T = undefined> = T extends undefined
  ? Record<string, T>
  : T;

export type QueryXData<T = undefined> = T extends undefined
  ? Record<string, T>
  : T;

export interface BodyData {
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

export type StatsData = {
  total_visitor: number;
  urls: string[];
  [key: number]: {
    visitor: number;
    url: string;
  };
  weekly: {
    index: number;
    visitor: number;
  };
  monthly: {
    month: month;
    visitor: number;
  };
};

type month =
  | 'Janvier'
  | 'Février'
  | 'Mars'
  | 'Avril'
  | 'Mai'
  | 'Juin'
  | 'Juillet'
  | 'Aout'
  | 'Septembre'
  | 'Octobre'
  | 'Novembre'
  | 'Décembre';

export interface ImageAnalysisResult {
  metadata: sharp.Metadata;
  dominantColors: string[];
  ocrText: string;
  imageHash: string;
  flagged: boolean;
}

export type timeOfJourney = 'Morning' | 'Midday' | 'Evening' | 'Night';

export type Post = {
  id: number;
  title: string;
  description: string;
  safe: boolean;
  date: Date;
  toUpdate: boolean;
  content: string | null;
  published: boolean;
  slug: string;
  categoryId: number | null;
  visites: bigint;
  user: string | null;
  fromApi: boolean;
};

export type PosterUserMeta = {
  [key: string]:
    | never
    | {
        id: number;
        title: string;
      }[];
};

export type Meta<T = unknown> = {
  userId: number;
  service: string;
} & T;
