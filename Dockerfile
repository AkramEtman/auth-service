FROM node:14-alpine

WORKDIR /fatura

COPY package*.json  /fatura/

RUN  npm install

EXPOSE 3000

COPY . .

RUN npm build

CMD ["npm", "start"]