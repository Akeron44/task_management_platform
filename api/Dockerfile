# Stage 1: Build stage
FROM node:20.11.1-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache for npm install
COPY package*.json ./

# Clean npm cache and install dependencies (using `npm ci` for consistency)
RUN npm cache clean --force
RUN npm ci --only=production

# Copy all source files into the container
COPY . .

# Build the application
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Stage 2: Production stage
FROM node:20.11.1-alpine AS production

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app /app

# Expose the application port
EXPOSE 4000

# Run Prisma migrations and then start the production app
CMD ["npm", "run", "start:migrate:prod"]


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