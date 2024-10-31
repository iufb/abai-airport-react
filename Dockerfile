FROM jitesoft/node-yarn:lts
WORKDIR /app

COPY package.json .

RUN yarn

RUN npm i -g serve

COPY . .
ARG VITE_PARSE_URL
RUN echo "VITE_PARSE_URL=\"$VITE_PARSE_URL\"" > .env
RUN yarn build


EXPOSE 3000

CMD [ "serve", "-s", "dist" ]
