# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built Next.js app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
