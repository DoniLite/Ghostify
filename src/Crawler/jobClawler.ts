import { ApifyCustomClient } from '../CrawlerClient'
import {CrawlerInput} from '../types/index'

const token = process.env.APIFY_API_TOKEN;

const sendUrlToCrawler = async (url: string) => {
    const input : CrawlerInput = {
        startUrls: [
            {
                url
            }
        ],
        maxRequestsPerCrawl: 100,
    }

    const Crawler = new ApifyCustomClient(token)
    const result = await Crawler.run(input)
    console.log(result);
}

const getDataFromCrawler = async() => {
    const Crawler = new ApifyCustomClient(token);
    
}