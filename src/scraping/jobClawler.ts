// import { DatasetClient, KeyValueStoreClient } from 'apify-client';
// import { ApifyCustomClient } from '../CrawlerClient'
// import {CrawlerInput} from '../types/index'

// const token = process.env.APIFY_API_TOKEN;

// export const sendUrlToCrawler = async (url: string, name: string) => {
//     const input : CrawlerInput = {
//         startUrls: [
//             {
//                 url,
//                 name
//             }
//         ],
//         maxRequestsPerCrawl: 100,
//     }

//     const Crawler = new ApifyCustomClient(token)
//     const result = await Crawler.run(input)
//     console.log(result);
// }

// export async function getDataFromCrawler<T extends keyof unknown>(options?: {client: boolean}): Promise<T[] | Record<string, T[] | DatasetClient>> {
//   const Crawler = new ApifyCustomClient(token);
//   const datasets = await Crawler.getDataset();
//   const data = datasets.data as T[];
//   const datasetClient = datasets.dataSetClient
//   if (options.client) {
//     return {
//         data,
//         datasetClient
//     } as const;
//   }
//   return data;
// }

// export async function getKeyValueStoreData<T>(
//   id: string,
//   key: string,
//   options?: { client: boolean }
// ): Promise<T | Record<string, T | KeyValueStoreClient>> {
//   const Crawler = new ApifyCustomClient(token);
//   const keyValueStore = await Crawler.getStoreValue(id, key);
//   const data = keyValueStore.data as T;
//   const client = keyValueStore.storeClient;
//   if (options.client) {
//     return {
//         data,
//         client
//     }
//   }
//   return data
// }

