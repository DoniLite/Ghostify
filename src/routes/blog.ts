import { RouteHandlerMethod } from "fastify";

export const article: RouteHandlerMethod = async (req, res) => {
  return res.view("/src/views/article.ejs", { pagination: 1, activeIndex: 3 });
};