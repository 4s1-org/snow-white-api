FROM node:14-alpine

RUN mkdir -p /app
WORKDIR /app

ENV TZ=Europe/Berlin

RUN npm i pnpm -g

COPY pnpm-workspace.yaml    .
COPY sw-shared/package.json ./sw-shared/
COPY sw-api/package.json    ./sw-api/
COPY sw-ui/package.json     ./sw-ui/
COPY pnpm-lock.yaml         .
RUN pnpm i -r
COPY . .

WORKDIR /app/sw-shared
RUN pnpm run build

WORKDIR /app/sw-api
RUN ls -la
RUN echo DATABASE_URL=file:./dev.db > .env
RUN ./node_modules/.bin/prisma generate
RUN pnpm run build
RUN cp -r ./src/generated ./dist/

EXPOSE 3000
WORKDIR /app/sw-api
CMD ["pnpm", "run", "start"]
