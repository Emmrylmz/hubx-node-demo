# Use a Node.js base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally for hot reloading in development
RUN npm install -g nodemon

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Use nodemon in development
CMD ["npm", "run", "dev"]
