FROM registry.gitlab.com/4s1/docker/node:14-alpine AS builder

WORKDIR /app

COPY pnpm-lock.yaml .
RUN pnpm fetch

COPY package.json .
RUN pnpm install --offline

COPY tsconfig.build.json .
COPY tsconfig.json .
COPY .eslintrc.yaml .
COPY src/ ./src/
RUN pnpm run build

# -----------------------------
FROM registry.gitlab.com/4s1/docker/node:14-alpine

WORKDIR /app

COPY --from=builder /app/pnpm-lock.yaml .
RUN pnpm fetch --prod

COPY --from=builder /app/tsconfig.build.json .
COPY --from=builder /app/tsconfig.json .
COPY --from=builder /app/package.json .
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist
EXPOSE 3000
VOLUME ["/app/data"]
CMD ["pnpm", "run", "start"]
