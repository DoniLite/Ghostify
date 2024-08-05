import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import fs from 'node:fs';

export const stats = (
    req: FastifyRequest,
    res: FastifyReply,
    next: HookHandlerDoneFunction
) => {
    next();
}