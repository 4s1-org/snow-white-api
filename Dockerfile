FROM node:14-alpine AS builder

RUN mkdir -p /app
WORKDIR /app

ENV TZ=Europe/Berlin
ENV LANG=de_DE.UTF-8

RUN npm i pnpm -g
RUN pnpm config set store-dir /app/.pnpm-store

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

# -----------------------------
FROM node:14-alpine

RUN mkdir -p /app
WORKDIR /app
ENV NODE_ENV production

RUN npm i pnpm -g
RUN pnpm config set store-dir /app/.pnpm-store

COPY --from=builder /app/.pnpm-store/           ./.pnpm-store/
COPY --from=builder /app/pnpm-workspace.yaml    .
COPY --from=builder /app/sw-shared/package.json ./sw-shared/
COPY --from=builder /app/sw-api/package.json    ./sw-api/
COPY --from=builder /app/pnpm-lock.yaml         .

RUN pnpm i -r

COPY --from=builder /app/sw-shared/dist/ ./sw-shared/dist/
COPY --from=builder /app/sw-api/dist/    ./sw-api/dist/

EXPOSE 3000
WORKDIR /app/sw-api
CMD ["pnpm", "run", "start"]
