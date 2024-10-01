import { RequestHandler } from 'express';
import { prismaClient } from '../config/db';
// import { sendUrlToCrawler } from "../scraping/jobClawler";
import { URL } from 'url';

interface BodyData {
  url?: string;
}

export const siteUrls: RequestHandler = async (req, res) => {
  const { url }: BodyData = req.body;
  const uri = new URL(url);
  const urlName = uri.hostname;
  const site = await prismaClient.url.create({
    data: {
      name: urlName,
      url: url,
      visit: 0,
    },
  });
  // await sendUrlToCrawler(url, urlName);
  if (site) {
    res.send(JSON.stringify({ urI: url }));
  }

  res.send(JSON.stringify({ status: false }));
};
