# Gunakan image Node.js sebagai base
FROM node:22

# install simple http server for serving static content
RUN npm install -g http-server

# Set working directory dalam container
WORKDIR /app_frontend

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# Salin code ke dalam container
COPY ./ ./

# Install dependencies
RUN npm install --no-fund --no-audit

# Salin semua file proyek
COPY . .

# Build aplikasi
RUN npm run build

# Expose port aplikasi
EXPOSE 8090

# Jalankan aplikasi
CMD [ "http-server", "dist"]