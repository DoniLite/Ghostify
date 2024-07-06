import { RouteHandlerMethod } from "fastify";
import { BodyData } from "../index";


export const store: RouteHandlerMethod = (req, res) => {
    const body: BodyData = req.body;
    console.log(body);
    return res.send(JSON.stringify({ message: "Data stored successfully" }));
}