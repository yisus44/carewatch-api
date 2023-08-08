# Set the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install --omit=dev

# Copy the rest of the application code to the container
COPY . .

# Set flag to production
ENV NODE_ENV=production

ENV NODE_OPTIONS="--max-old-space-size=8192"

# Build the application
RUN npm run build

# Expose the port on which the application will run
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
