FROM node:lts-alpine

LABEL maintainer="THeheHe HA Team"
LABEL summary="BINK Proxy Image"
LABEL description="Example application of e which can be deployed in production."

ENV NODE_ENV=production
WORKDIR /app

RUN apk add --upgrade --no-cache python3 make g++

RUN npm install --global corepack@latest

COPY package.json /app/package.json
COPY pnpm-lock.yaml /app/pnpm-lock.yaml

RUN corepack install
RUN pnpm install

COPY . /app

EXPOSE 8080

ENTRYPOINT [ "node" ]
CMD ["src/index.js"]
