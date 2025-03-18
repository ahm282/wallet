# -------- Build Stage --------
FROM node:22-alpine AS build

# Set the environment variables
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_CLIENT_SECRET
ARG VITE_ENV_NAME

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the remaining source code
COPY . .

# Use the environment variables to build the frontend
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}
ENV VITE_GOOGLE_CLIENT_SECRET=${VITE_GOOGLE_CLIENT_SECRET}
ENV VITE_ENV_NAME=${VITE_ENV_NAME}

# Build the frontend (adjust the build command if needed)
RUN npm run build

# -------- Production Stage --------
FROM nginx:stable-alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to serve the app
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
