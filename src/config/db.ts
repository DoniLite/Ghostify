import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

export const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 16063,
  },
});

client.connect()
.then(data=> {
    console.log(data);
})
.catch(err => {
    console.log(err);
});

export const prismaClient = new PrismaClient()
