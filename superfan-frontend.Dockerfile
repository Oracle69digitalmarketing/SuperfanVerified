# Frontend Dockerfile

FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and lock file first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY . .

# Expose React dev server port
EXPOSE 19006

# Start Expo web/Metro bundler
CMD ["npm", "start"]
