import {
  ActorBuildOptions,
  ActorCallOptions,
  ActorLastRunOptions,
  ActorRun,
  Build,
  BuildClient,
  BuildCollectionClient,
  DatasetClient,
  KeyValueClientListKeysOptions,
  KeyValueListItem,
  KeyValueStoreClient,
  RequestQueueClient,
  RequestQueueCollectionClient,
  RequestQueueUserOptions,
  RunClient,
  RunCollectionClient,
} from 'apify-client';
import { ActorVersionClient } from 'apify-client/dist/resource_clients/actor_version';
import sharp from 'sharp';

export interface Service {
  APIs?: {
    name: string;
    endpoint: string;
    docs?: string;
    isSecure?: boolean;
  }[];
  chekHealth?: (service: string, endpoint: string) => boolean;
  Platform?: {
    internals: boolean;
    externals: boolean;
    API: boolean;
    Sockets: boolean;
  };
}


export interface Auth {
  id?: number;
  login?: string;
  authenticated: boolean;
}

export interface Indexer {
  id: number;
  keys: string;
  postId: number | null;
  type: string;
}

export interface Section {
  id: number;
  postId: number;
  title: string;
  content: string | null;
  indedx: number;
  header: boolean;
  meta: string | null;
}

export interface CrawlerClient {
  runActorsAndGetOutputs<T>(
    input: CrawlerInput,
    runtimeOptions?: RuntimeOptions
  ): Promise<T[]>;

  run<T extends CrawlerOutPuts<never>>(
    input: CrawlerInput,
    runOptions?: RunOptions
  ): Promise<T>;

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

type FetchFn = typeof fetch;

export type RunOptions = Record<string, string>;

export interface Builder {
  build: Build;
  buildInstance: BuildClient;
}

export interface Dataset<T extends DatasetRecord> {
  data: T[];
  dataSetClient?: DatasetClient<T>;
}

export type DatasetRecord = Record<string, string | number | symbol>;

export interface StoreValue<T extends keyof unknown> {
  data: T;
  storeClient: KeyValueStoreClient;
}

export interface RuntimeOptions extends ActorCallOptions {
  iterateToConsole?: boolean;
}

type Run = ActorRun;

export type CrawlerOutPuts<T extends keyof unknown> = {
  data: Record<string | number, T>[];
} & Run;

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

export interface StatsData {
  total_visitor: number;
  urls: {
    visitor: number;
    url: string;
  }[];
  weekly: {
    index: number;
    visitor: number;
  };
  monthly: {
    month: month;
    visitor: number;
  };
}

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

export interface Post {
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
}

export type PosterUserMeta = Record<
  string,
  | never
  | {
      id: number;
      title: string;
    }[]
>;

export type Meta<T = unknown> = {
  userId: number;
  service: string;
} & T;
