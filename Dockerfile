FROM node:14-alpine
RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY tsconfig.json tsconfig.build.json ./
RUN npm run build

EXPOSE 6000
CMD ["npm", "start"]
