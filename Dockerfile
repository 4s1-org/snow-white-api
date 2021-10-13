FROM registry.gitlab.com/4s1/docker/node:14-alpine

WORKDIR /app

COPY package.json     .
COPY pnpm-lock.yaml   .
RUN pnpm i -r
COPY . .

RUN echo DATABASE_URL=file:./dev.db > .env
RUN pnpm dlx prisma generate
RUN pnpm run build
RUN cp -r ./src/generated ./dist/

EXPOSE 3000
CMD ["pnpm", "run", "start"]
