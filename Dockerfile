FROM node:12.18-alpine

RUN mkdir -p /usr/app/discord_bot

WORKDIR /usr/app/discord_bot

COPY ./package*.json ./

RUN npm i

CMD ["npm", "start"]