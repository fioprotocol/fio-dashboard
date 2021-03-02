FROM node:8.11.1

WORKDIR /usr/app

COPY package.json /usr/app/
RUN npm install

COPY . .

EXPOSE 9000
CMD ["npm", "run", "server:dev"]