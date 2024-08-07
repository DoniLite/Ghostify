import { FastifyReply, FastifyRequest } from "fastify";
import MarkdownIt from "markdown-it";
import { prismaClient } from "../config/db";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export const terms = async (req: FastifyRequest, res: FastifyReply) => {};

export const license = async (req: FastifyRequest, res: FastifyReply) => {};

export const about = async (req: FastifyRequest, res: FastifyReply) => {};

export const policy = async (req: FastifyRequest, res: FastifyReply) => {};