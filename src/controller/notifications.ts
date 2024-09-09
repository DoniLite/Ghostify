import { RouteHandlerMethod } from "fastify";
import { BodyData } from "../@types/index";

export const notifications: RouteHandlerMethod = async (req, res) => {
    const data: BodyData = req.body;
    console.log(data);
    return res.code(200);
};
