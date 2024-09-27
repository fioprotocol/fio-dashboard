FROM node:16.14.2
WORKDIR /usr/app

COPY package.json /usr/app/
RUN npm i --legacy-peer-deps

COPY . .

EXPOSE 9000
CMD ["npm", "run", "server:dev"]
