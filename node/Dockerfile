FROM node

RUN mkdir /app
WORKDIR /app

COPY package.json ./
COPY package.lock ./

RUN npm install && npm i -g typescript  ts-node

COPY . .

RUN npm run build

expose 3000
CMD [ 'npm', 'start' ]
