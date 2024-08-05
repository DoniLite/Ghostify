import { ApifyCustomClient } from '../CrawlerClient'
import {CrawlerInput} from '../types/index'

const token = process.env.APIFY_API_TOKEN;

export const sendUrlToCrawler = async (url: string, name: string) => {
    const input : CrawlerInput = {
        startUrls: [
            {
                url,
                name
            }
        ],
        maxRequestsPerCrawl: 100,
    }

    const Crawler = new ApifyCustomClient(token)
    const result = await Crawler.run(input)
    console.log(result);
}

export const getDataFromCrawler = async() => {
    const Crawler = new ApifyCustomClient(token);
    
}