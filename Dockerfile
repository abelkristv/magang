# Stage 1: Build the Vite application
FROM node:16 AS build
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install

# Copy the entire frontend directory
COPY ./frontend ./

# Run the Vite build command
RUN npm run build

# Debugging step: Ensure dist directory exists
RUN ls -al /app/dist

# Stage 2: Serve the Vite application with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
