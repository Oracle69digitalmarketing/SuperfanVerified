# -------- Stage 1: Build --------
FROM node:18 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build (choose depending on setup: Vite or Expo web)
# For Vite:
RUN npm run build

# For Expo web:
# RUN npm run web-build

# -------- Stage 2: Serve --------
FROM nginx:alpine

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html
# Or if Expo web: COPY --from=builder /app/web-build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
