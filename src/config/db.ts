import pkg from '@prisma/client';

const { PrismaClient } = pkg;

export const prismaClient = new PrismaClient();
