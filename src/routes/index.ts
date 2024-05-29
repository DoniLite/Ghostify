import { RouteHandlerMethod } from "fastify";
export const index: RouteHandlerMethod = async (req, res) => {
  res.code(200);
  res.header('x-content-type-options', 'html/text');
  return res.view("/src/views/loader.ejs", {
    pagination: 0,
    activeIndex: 0,
  });
};