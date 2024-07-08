import { ApifyClient } from "apify-client";
import { CrawlerClient, CrawlerInput, CrawlerOutPuts, RunOptions, RuntimeOptions } from "./types/index";

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
