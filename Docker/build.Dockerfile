FROM node:12 as base
WORKDIR app/
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

FROM base as build
COPY package.json \
      yarn.lock \
      lerna.json \
      tsconfig.json \
      tslint.json \
      ./
COPY . .
COPY
RUN yarn install
RUN yarn bootstrap