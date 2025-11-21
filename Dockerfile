# Dockerfile

# 1. Use Node base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Copy Prisma schema (needed for postinstall script)
COPY prisma ./prisma

# 5. Install dependencies (postinstall will run prisma generate)
RUN npm install

# 6. Copy the rest of the app (but not media files)
COPY . .

# 7. Build the Next.js app
RUN npm run build

# 8. Expose the port
EXPOSE 3000

# 9. Start the app
CMD ["npm", "run", "start"]
