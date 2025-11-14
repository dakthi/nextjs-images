# Dockerfile for VL London - Build and Serve Static Files

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Install serve to host static files
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Serve the .next directory
CMD ["serve", "-s", ".next", "-l", "3000"]
