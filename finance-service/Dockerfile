# Use official Node.js image as base
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the app (if using TypeScript)
RUN npm run build

# Expose the application port
EXPOSE 8082

# Command to run the application
CMD ["node", "dist/main"]
