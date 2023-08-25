FROM node:alpine

RUN mkdir -p /usr/src/ivorypay-test && chown -R node:node /usr/src/ivorypay-test

WORKDIR /usr/src/ivorypay-test

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 8080