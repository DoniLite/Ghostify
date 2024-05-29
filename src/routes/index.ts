import { RouteHandlerMethod } from "fastify";
export const index: RouteHandlerMethod = async (req, res) => {
  res.code(200);
  return res.view("/src/views/loader.ejs", {
    pagination: 0,
    activeIndex: 0,
  });
};