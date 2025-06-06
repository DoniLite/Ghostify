
// import { createClient } from 'redis';
// @ts-types="@types/pg"
// import pg from 'pg';
// import { PrismaPg } from '@prisma/adapter-pg';
// import process from "node:process";

import pkg from '@prisma/client';

const { PrismaClient } = pkg;

// const { Pool } = pg;
// const connectionString = `${process.env.DATABASE_URL}`;

// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool, {
//   schema: 'own',
// });

// export const client = createClient({
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: 16063,
//   },
// });

// client
//   .connect()
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// export const redisStoreClient = createClient();

// redisStoreClient
//   .connect()
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

export const prismaClient = new PrismaClient();

// redisStoreClient.connect().catch(console.error);
