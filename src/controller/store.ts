import { RouteHandlerMethod } from "fastify";
import { BodyXData } from "../@types/index";


export const store: RouteHandlerMethod = (req, res) => {
    const body = req.body as BodyXData;
    console.log(body);
    return res.send(JSON.stringify({ message: "Data stored successfully" }));
}