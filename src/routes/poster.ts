import { FastifyReply, FastifyRequest } from "fastify";
import { QueryXData } from "../@types";
import { decrypt, encrypt } from "../utils";


export const poster = async (req: FastifyRequest, res: FastifyReply) => {
    const {} = req.query as QueryXData;
    const cookie = req.cookies
    const lastTime = cookie['connection_time'];
    try {
      if (
      lastTime !== req.session.Token &&
      Date.now() <
      Number(
        decrypt(
          lastTime,
          req.session.ServerKeys.secretKey,
          req.session.ServerKeys.iv
        )
      )
    ) {
      return res.status(400).view("/src/views/signin.ejs", { service: "blog" });
    }
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    res.setCookie(
      "connection_time",
      encrypt(
        Date.now().toString(),
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      ),
      {
        expires: cookieExpriration,
      }
    );
    return res.view('/src/views/poster.ejs', {id: 1})
    } catch (e) {
      return res
        .status(400)
        .view("/src/views/signin.ejs", { service: 'blog' });
    }
}


export const requestComponent = (req: FastifyRequest, res: FastifyReply) => {
  const { section } = req.query as QueryXData<{ section: number }>;
  const cookie = req.cookies;
  const lastTime = cookie["connection_time"];
  try {
    if (
      lastTime !== req.session.Token &&
      Date.now() <
        Number(
          decrypt(
            lastTime,
            req.session.ServerKeys.secretKey,
            req.session.ServerKeys.iv
          )
        )
    ) {
      return res.status(400).view("/src/views/signin.ejs", { service: "blog" });
    }
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    res.setCookie(
      "connection_time",
      encrypt(
        Date.now().toString(),
        req.session.ServerKeys.secretKey,
        req.session.ServerKeys.iv
      ),
      {
        expires: cookieExpriration,
      }
    );
    return res.view("/src/views/components/section.ejs", {
      id: Number(section) + 1,
    });
  } catch (e) {
    return res.status(400).view("/src/views/signin.ejs", { service: "blog" });
  }
}