import { FastifyReply, FastifyRequest } from "fastify";
import { QueryXData } from "index";
import { decrypt, encrypt } from "../utils";


export const poster = async (req: FastifyRequest, res: FastifyReply) => {
    const {} = req.query as QueryXData;
    const cookie = req.cookies
    const lastTime = cookie['connection_time'];
    console.log(lastTime);
    console.log(Number(decrypt(lastTime)));
    if (Date.now() < Number(decrypt(lastTime))) {
        return res.status(400).view("/src/views/signin.ejs");
    }
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    res.setCookie("connection_time", encrypt(Date.now().toString()), {
      expires: cookieExpriration,
    });
}