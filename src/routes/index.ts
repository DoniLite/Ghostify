import { RouteHandler } from "fastify";
import { encrypt } from "../utils";
export const index: RouteHandler = async (req, res) => {
  const loaderCookie = req.cookies["ghostify_home_session"];
  if (!loaderCookie || Object.keys(JSON.parse(loaderCookie)).length <= 0) {
    const cookieExpriration = new Date();
    cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
    req.session.Token = encrypt(
      Date.now().toString(),
      req.session.ServerKeys.secretKey,
      req.session.ServerKeys.iv
    );
    res.setCookie('connection_time', req.session.Token, {
      expires: cookieExpriration,
    });
    return res.view('/src/views/loader.ejs', {
      pagination: 0,
      activeIndex: 0,
    });
  }
  return res.redirect('/home?persisted=true');
};
