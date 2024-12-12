# Use Node.js 16 as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install all dependencies, including dev dependencies like nodemon
RUN npm install

# Install nodemon specifically as a dev dependency
RUN npm install nodemon --save-dev

RUN npm install -g ts-node
RUN npm install -g nodemon
RUN npm i -g --save-dev @types/node


# Copy the rest of your application code to the container
COPY . .

# Expose port 3001 to the host
EXPOSE 3001

# Command to run your application in development mode
CMD ["npm", "run", "dev"]
