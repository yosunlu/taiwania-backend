# Use an official Node.js runtime as a parent image
FROM --platform=linux/amd64 node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 4000

# Define the command to run your application
CMD ["node", "index.js"]
