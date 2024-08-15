import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { colors, generateAndSaveKeys, graphicsUploader, loadKeys } from "../utils";

export const sessionStorageHook = async (
    req: FastifyRequest,
    res: FastifyReply,
) => {
    req.session.Theme = {
      time: graphicsUploader(),
      ...colors
    };
    const keys = await loadKeys()
    if (!keys) {
        await generateAndSaveKeys();
        req.session.ServerKeys = await loadKeys();
    }
    req.session.ServerKeys = keys
      // req.setSession = async (payload: any, dest: 'Weather'|'Quote' ) => {
      //     if (dest === 'Weather') {
      //         req.session.Weather = payload;
      //     }
      //     if (dest === 'Quote') {
      //         req.session.Quote = payload;
      //     }
      // }
}