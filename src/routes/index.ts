import { RouteHandlerMethod } from "fastify";
import { encrypt } from "../utils";
export const index: RouteHandlerMethod = async (req, res) => {
  const cookieExpriration = new Date();
  cookieExpriration.setMinutes(cookieExpriration.getMinutes() + 15);
  res.code(200);
  req.session.Token = encrypt(Date.now().toString());
  res.setCookie("connection_time", encrypt(Date.now().toString()), {
    expires: cookieExpriration,
  });
  return res.view("/src/views/loader.ejs", {
    pagination: 0,
    activeIndex: 0,
  });
};