import { RouteHandlerMethod } from "fastify";
import { prismaClient } from "../config/db";

interface BodyData {
    url?: string;
}

export const siteUrls: RouteHandlerMethod = async (req, res) => {
    const {url}: BodyData = req.body
    const result = await prismaClient
    return res.send(JSON.stringify({ urI: url }));
}