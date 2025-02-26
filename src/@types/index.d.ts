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
import sharp from 'sharp';
import { prismaClient } from '../config/db.ts';
import { Can } from '../utils.ts';
export { Post } from '@prisma/client';
// @ts-types="npm:@types/ws"
import { type WebSocket as WebSocketS } from 'npm:ws';
import { type Buffer } from 'node:buffer';


interface ActorVersionClient {
  get(): void
}

export interface Service {
  APIs?: {
    name: string;
    endpoint: string;
    docs?: string | null;
    isSecure?: boolean;
  }[];
  chekHealth?: (service: string, endpoint: string) => boolean;
  Platform?: {
    internals: boolean;
    externals?: boolean;
    API: boolean;
    Sockets?: boolean;
  };
}

export interface UserActor {
  checkPermissions(permissions: Can[]): void;
}

export interface Secrets {
  key: Buffer;
  iv: Buffer;
}

export type Actions<T, U extends keyof T = keyof T> = Pick<T, U>;

export type Inf<T extends Can[]> = T extends (infer U)[]
  ? U extends Can.CRUD ? { data: typeof prismaClient }
  : U extends Can.CreateUser ? { data: typeof prismaClient.user }
  : U extends Can.MakeComment ? { data: typeof prismaClient.comment }
  : U extends Can.MakeSecureAction ? { data: typeof prismaClient }
  : never
  : never;

export interface Certificates {
  pass: string;
  health: string;
  permissions: Can[];
}

export interface Auth {
  id?: number;
  login?: string;
  isSuperUser?: boolean;
  authenticated: boolean;
  username?: string;
  fullname?: string;
  file?: string;
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
  index: number;
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

  getRunsCollection(): RunCollectionClient;

  getVersionClient(actorId: string, versionNumber: string): ActorVersionClient;

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

export type FetchFn<T = unknown> = Promise<T>;

export type RunOptions = Record<string, string>;

export interface Builder {
  build?: Build;
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
  ? Record<string, unknown>
  : T;

export type QueryXData<T = undefined> = T extends undefined
  ? Record<string, unknown>
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

export type month =
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

export interface DocumentStorage {
  title: string;
  desc_or_meta: string;
  section: {
    index: number;
    title: string;
    content: string;
  }[];
  image: {
    img: never;
    index: number;
    section: number;
  }[];
  list: Record<
    string,
    [
      {
        index: number;
        items: {
          item: string;
          description: string;
          index: number;
          section: number;
        }[];
      },
    ]
  >;
}

export interface PostFile {
  id: number;
  filePath: string;
  sectionId: number;
  index: number;
  postId: number;
}

export interface List {
  index: number;
  items: {
    description: string;
    item: string;
    index: number;
    section: number;
  }[];
}

export type DocDataUnion = PostFile | List;

export interface Checker {
  pass: boolean;
  services: Service['APIs'];
}

export interface HealthCheckerInterface {
  check(service: string, endpoint?: string): Promise<boolean>;
  health(): Promise<Service['Platform']>;
}

declare global {
  interface WebSocket extends WebSocketS {
    on: WebSocketS['on'];
  }

  interface globalThis {
    App: Record<string, unknown>;
  }

  const App: Record<string, unknown>;
}

export interface RawCV {
  img?: string;
  cvType: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthday: string;
  profile: string;
  skills: string[];
  interest: string[];
  formations: {
    formation: string;
    certificate: string;
    certificationDate: string;
  }[];
  experiences: {
    experience: string;
    details: {
      task: string;
      taskDate: string;
    }[];
  }[];
  languages: {
    lang: string;
    level: string;
  }[];
}

export interface SecurityHashPayload {
  hash: string;
  env: string;
  expire: string;
}
