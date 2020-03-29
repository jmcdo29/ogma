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
COPY packages/platform-socket.io ./packages/platform-socket.io
COPY integration/socket.io/ ./integration/socket.io
RUN yarn install
RUN yarn bootstrap
RUN yarn build
RUN cd integration/socket.io
RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["node", "integration/socket.io/dist/main.js"]
