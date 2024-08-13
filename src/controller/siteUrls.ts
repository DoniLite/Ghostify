import { RouteHandlerMethod } from "fastify";
import { prismaClient } from "../config/db";
// import { sendUrlToCrawler } from "../scraping/jobClawler";
import { URL } from "url";

interface BodyData {
    url?: string;
}

export const siteUrls: RouteHandlerMethod = async (req, res) => {
    const {url}: BodyData = req.body;
    const uri = new URL(url);
    const urlName = uri.hostname;
    const site = await prismaClient.url.create({
        data: {
            name: urlName,
            url: url,
            visit: 0
        }
    })
    // await sendUrlToCrawler(url, urlName);
    if (site) {
        return res.send(JSON.stringify({ urI: url }));
    }

    return res.send(JSON.stringify({status: false}))
}