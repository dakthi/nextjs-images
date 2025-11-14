# Dockerfile for VL London - Static Site Build

# 1. Use Node base image for building
FROM node:18-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm ci

# 5. Copy the rest of the app
COPY . .

# 6. Build the static site
RUN npm run build

# 7. Use a lightweight image for serving static files
FROM node:18-alpine

# 8. Set working directory
WORKDIR /app

# 9. Copy built static files from builder
COPY --from=builder /app/out ./out

# 10. Copy public assets from source
COPY public ./public

# 11. Install serve to host static files
RUN npm install -g serve

# 12. Expose the port
EXPOSE 3000

# 13. Start serving static files
CMD ["serve", "-s", "out", "-l", "3000"]
