FROM node:20.11.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install

COPY . .
RUN npm run build

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "start:migrate:prod" ]
