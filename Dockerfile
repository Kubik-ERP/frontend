# 1. Build Vue.js menggunakan Node.js
FROM node:22 AS build-stage

# Set working directory
WORKDIR /app_frontend

# Copy package.json dan install dependencies
COPY package*.json ./
RUN npm install --no-fund --no-audit

# Copy semua source code ke dalam container
COPY . .

# Build Vue.js
RUN npm run build

# 2. Gunakan Nginx sebagai web server untuk production
FROM nginx:alpine AS production-stage

# Copy konfigurasi Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build dari tahap sebelumnya ke dalam Nginx
COPY --from=build-stage /app_frontend/dist /usr/share/nginx/html

# Expose port 8090
EXPOSE 8090

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]