import { RouteHandlerMethod } from "fastify";


export const webhooks: RouteHandlerMethod = async (req, res) => {
    req.socket.emit('data', JSON.stringify(req.query));
    return res.code(200).send('event dispactched');
}