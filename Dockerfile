# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of app
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "run", "devStart"]