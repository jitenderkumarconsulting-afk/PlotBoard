# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application code
COPY . .

# Build the application
RUN npm run build

# Specify the command to run the application
CMD ["node", "dist/src/main"]
