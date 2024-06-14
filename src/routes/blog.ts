import { RouteHandlerMethod } from "fastify";

export const blog: RouteHandlerMethod = async (req, res) => {
  return res.view("/src/views/blogOne.ejs", { pagination: 1, activeIndex: 3 });
};