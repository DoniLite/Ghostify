#!/bin/bash

echo "fetching data from remote service"

git pull origin main

echo "installing dependencies to update the project"

pnpm install

echo "stopping all running instances"

pm2 stop all

echo "running the build script"

pnpm build

echo "starting the new instace"

pm2 start pnpm -- run start && pm2 list

echo "reloading nginx proxy server"

sudo nginx -s reload