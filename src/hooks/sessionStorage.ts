import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export const sessionStorageHook = (
    req: FastifyRequest,
    res: FastifyReply,
    next: HookHandlerDoneFunction
) => {
    req.setSession = async (payload: any, dest: 'Weather'|'Quote' ) => {
        if (dest === 'Weather') {
            req.session.Weather = payload;
        }
        if (dest === 'Quote') {
            req.session.Quote = payload;
        }
    }
    req.session.Weather = {}
    req.session.Quote = {}
    next();
}