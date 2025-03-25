# Gunakan image Node.js sebagai base
FROM node:22

# Set working directory dalam container
WORKDIR /app_frontend

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
CMD ["npm", "preview"]