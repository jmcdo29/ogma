FROM node:12 as base
WORKDIR app/
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
COPY package.json \
      yarn.lock \
      lerna.json \
      tsconfig.json \
      ./
COPY packages/logger/ ./packages/logger/
COPY packages/nestjs-module/ ./packages/nestjs-module
COPY packages/platform-express ./packages/platform-express
COPY integration/express/ ./integration/express
RUN yarn install
RUN yarn bootstrap
RUN yarn build
RUN cd integration/express
RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["node", "integration/express/dist/main.js"]
