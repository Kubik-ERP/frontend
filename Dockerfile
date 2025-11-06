# =======================================================
# 1️⃣ STAGE: BUILD FRONTEND APP (Node.js 22)
# =======================================================
FROM node:22 AS build-stage

# Set working directory
WORKDIR /app_frontend

# Copy dependency files
COPY package*.json ./

# Install dependencies (disable audit and fund output)
RUN npm install --no-fund --no-audit

# Copy the rest of the project
COPY . .

# Increase Node memory limit to prevent OOM during build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Run type checking + Vite build
RUN npm run build

# =======================================================
# 2️⃣ STAGE: PRODUCTION (Nginx)
# =======================================================
FROM nginx:alpine AS production-stage

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from the previous stage
COPY --from=build-stage /app_frontend/dist /usr/share/nginx/html

# Expose port 8090 (match your nginx.conf)
EXPOSE 8090

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
