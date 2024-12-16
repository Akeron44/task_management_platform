FROM node:20-alpine

WORKDIR '/app'

COPY ./api .
RUN npm install
COPY . .
CMD ["npm", "start:migrate:prod"]