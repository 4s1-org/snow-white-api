FROM registry.gitlab.com/4s1/docker/node:14-alpine

WORKDIR /app

COPY package.json     .
COPY pnpm-lock.yaml   .
RUN pnpm i -r
COPY . .

RUN pnpm run build

EXPOSE 3000
VOLUME ["/app/data"]
CMD ["pnpm", "run", "start"]
