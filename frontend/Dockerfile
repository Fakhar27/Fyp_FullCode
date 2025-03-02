# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port 5173 (default Vite dev server port)
EXPOSE 5173

# Start Vite dev server with host set to allow external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]