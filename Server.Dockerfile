# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.6.1
ARG PNPM_VERSION=9.1.3

################################################################################
FROM node:${NODE_VERSION}-alpine as base

# Install necessary system packages
RUN apk add --no-cache sudo shadow

# Create a user with sudo rights
RUN addgroup -S appgroup && \
    adduser -S -G appgroup -s /bin/sh node && \
    echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node

WORKDIR /usr/src/app

# Give ownership to node user
RUN chown -R node:appgroup /usr/src/app

# Install pnpm
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

################################################################################
FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

################################################################################
FROM deps as build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY --chown=node:appgroup . .
RUN pnpm run build

################################################################################
FROM base as final

ENV NODE_ENV production

# Ensure proper permissions for the node user
USER node
RUN mkdir -p /usr/src/app/logs /usr/src/app/uploads

COPY --chown=node:appgroup package.json .
COPY --chown=node:appgroup ./src ./src
COPY --chown=node:appgroup --from=deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:appgroup --from=build /usr/src/app/build ./build
COPY --chown=node:appgroup --from=build /usr/src/app/prisma ./prisma

EXPOSE 3081

CMD pnpm start