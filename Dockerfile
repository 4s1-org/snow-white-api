FROM node:14-alpine

RUN mkdir -p /app
WORKDIR /app

RUN npm i pnpm -g

COPY pnpm-workspace.yaml .
COPY sw-shared/package.json ./sw-shared/
COPY sw-api/package.json ./sw-api/
COPY sw-ui/package.json ./sw-api/
COPY pnpm-lock.yaml .
RUN pnpm i
COPY . .

WORKDIR /app/sw-shared
RUN pnpm run build

WORKDIR /app/sw-api
RUN ls -la
RUN pnpm i
RUN echo DATABASE_URL=file:./dev.db > .env
RUN ./node_modules/.bin/prisma generate
RUN pnpm run build

WORKDIR /app/sw-api
CMD ["pnpm", "run", "start"]
