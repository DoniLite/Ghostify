# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.6.1
ARG PNPM_VERSION=9.1.3

################################################################################
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

################################################################################
FROM base AS deps

# Install dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

COPY ./prisma ./prisma

# Ajout de la génération Prisma
RUN pnpm dlx prisma

RUN pnpx prisma generate

ENV DATABASE_URL=postgresql://doni:DoniLite13@localhost:5432/ghostifyDB?schema=public&connection_limit=5

RUN  pnpx prisma migrate deploy

################################################################################
FROM deps AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

################################################################################
FROM base AS final

ENV NODE_ENV=production

RUN mkdir -p /usr/src/app/build/data && chown -R node:node /usr/src/app/build && chmod -R 755 /usr/src/app/build

USER node

COPY package.json .

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/build/ ./build/

EXPOSE 3081

CMD ["pnpm", "start"]
