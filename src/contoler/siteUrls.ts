import { RouteHandlerMethod } from "fastify";

interface BodyData {
    url?: string;
}

export const siteUrls: RouteHandlerMethod = async (req, res) => {
    const {url}: BodyData = req.body
    return res.send(JSON.stringify({ urI: url }));
}