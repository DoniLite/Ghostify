import { ActorBuildOptions, ActorLastRunOptions, ApifyClient, Build, BuildCollectionClient, KeyValueClientListKeysOptions, KeyValueListItem, PaginatedList, RequestQueueClient, RequestQueueCollectionClient, RequestQueueUserOptions, RunClient, RunCollectionClient } from "apify-client";
import { Builder, CrawlerClient, CrawlerInput, CrawlerOutPuts, Dataset, DatasetRecord, RunOptions, RuntimeOptions, StoreValue } from "./types/index";
import { ActorVersionClient } from "apify-client/dist/resource_clients/actor_version";

export class ApifyCustomClient implements CrawlerClient {
  #client: ApifyClient;
  constructor(token: string) {
    this.#client = new ApifyClient({ token });
  }

  async runActorsAndGetOutputs<CrawlerOutPuts>(
    input: CrawlerInput,
    runtimeOptions?: RuntimeOptions
  ): Promise<CrawlerOutPuts[]> {
    const run = await this.#client.actor("kRn80VXoQpNq9gVod").call(input);

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    if (runtimeOptions.iterateToConsole) {
      console.log("The request have been completed");
      console.log("...printing results");
      items.forEach((item) => console.dir(item));
    }
    return items as CrawlerOutPuts[];
  }

  async run<CrawlerOutPuts>(
    input: CrawlerInput,
    runOptions?: RunOptions
  ): Promise<CrawlerOutPuts[]> {
    const run = await this.#client.actor("kRn80VXoQpNq9gVod").start(input);

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    return items as CrawlerOutPuts[];
  }

  async crawlerBuilder(
    versionNumber: string,
    crawlOptions?: ActorBuildOptions
  ): Promise<Builder> {
    const build = await this.#client.build(versionNumber);
    const buildGeted = await build.get(crawlOptions);
    return {
      build: buildGeted,
      buildInstance: build,
    };
  }

  async getLastRunClient(options?: ActorLastRunOptions): Promise<RunClient> {
    const run = await this.#client.actor("kRn80VXoQpNq9gVod");
    const lastRun = run.lastRun(options);
    return lastRun;
  }

  async getRequestQueueCollection(): Promise<RequestQueueCollectionClient> {
    const requestQueueCollection = await this.#client.requestQueues();
    return requestQueueCollection;
  }

  async getRequestQueue(
    id: string,
    options?: RequestQueueUserOptions
  ): Promise<RequestQueueClient> {
    const requestQueueClient = await this.#client.requestQueue(id, options);
    return requestQueueClient;
  }

  async getBuildsCollection(): Promise<BuildCollectionClient> {
    const buildCollectionClient = await this.#client.builds();
    return buildCollectionClient;
  }

  async getRunsCollection(): Promise<RunCollectionClient> {
    const runCollection = this.#client.runs();
    return runCollection;
  }

  async getVersionClient(
    actorId: string,
    versionNumber: string
  ): Promise<ActorVersionClient> {
    const run = this.#client.actor(actorId);
    const version = run.version(versionNumber);
    return version;
  }

  async getDataset<T extends DatasetRecord>(id: string): Promise<Dataset<T>> {
    const run = await this.#client.actor("kRn80VXoQpNq9gVod");
    const dataset = await this.#client.dataset(id);
    const datasets = (await dataset.listItems()).items as T[];
    const data = {
      data: datasets,
      dataSetClient: dataset,
    } as Dataset<T>;
    return data;
  }

  async getKeyList(
    id: string,
    options?: KeyValueClientListKeysOptions
  ): Promise<KeyValueListItem[]> {
    const store = await this.#client.keyValueStore(id);
    const keys = (await store.listKeys()).items;
    return keys;
  }

  async getStoreValue<T extends keyof unknown>(
    id: string,
    key: string
  ): Promise<StoreValue<T> | undefined> {
    const store = await this.#client.keyValueStore(id);
    const verify = await store.recordExists(key);
    if (!verify) {
        return undefined
    }
    const value = await store.getRecord(key) as T
    return{
        data: value,
        storeClient: store,
    }
  };
}


// Prepare Actor input
const input = {
  startUrls: [
    {
      url: "https://crawlee.dev",
    },
  ],
  maxRequestsPerCrawl: 100,
};

type Data = {
    url: string;
    title: string;
}

const aCC = new ApifyCustomClient('djhccwbc');

// Initialize the ApifyClient with API token
const client = new ApifyClient({
  token: "<YOUR_API_TOKEN>",
});



(async () => {
  // Run the Actor and wait for it to finish
  const run = await client.actor("kRn80VXoQpNq9gVod").call(input);

  // Fetch and print Actor results from the run's dataset (if any)
  console.log("Results from dataset");
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  items.forEach((item) => {
    console.dir(item);
  });
})();
