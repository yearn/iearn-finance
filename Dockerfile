FROM node:10

ADD . /iearn-finance
WORKDIR /iearn-finance

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]