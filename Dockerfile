FROM node:14-alpine

RUN mkdir -p /app
WORKDIR /app

RUN npm i pnpm -g

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm i
COPY . .
RUN pnpm run build

RUN ls -la
WORKDIR /app/sw-api
CMD ["pnpm", "run", "start"]
