# FROM node:20.11.1-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm cache clean --force
# RUN npm install

# COPY . .
# RUN npm run build

# RUN npx prisma generate

# EXPOSE 4000

# CMD ["npm", "run", "start:migrate:prod" ]

FROM node:20.11.1-alpine

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

RUN npm cache clean --force
RUN npm install

# Copy all source files into the container
COPY . .

# Build the application
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Run Prisma migrations only once when the container is deployed
RUN npx prisma migrate deploy

# Expose the application port
EXPOSE 4000

# Command to start the app
CMD ["npm", "run", "start:prod"]
