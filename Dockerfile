FROM jitesoft/node-yarn:lts
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .
RUN yarn build

EXPOSE 3000

CMD [ "node", "server.mjs" ]
