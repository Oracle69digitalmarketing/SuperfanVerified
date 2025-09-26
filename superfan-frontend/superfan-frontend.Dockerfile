# Frontend Dockerfile

# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run web-build   # Expo web build → outputs to web-build/

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/web-build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
