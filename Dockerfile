# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prod

# Production stage
FROM openresty/openresty:1.21.4.1-alpine
LABEL package="Lingui.Cards.Frontend"

# Remove default nginx static assets
RUN rm -rf /usr/local/openresty/nginx/html/*

# Copy nginx configuration if you have a custom one
# COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

# Copy static assets from builder stage
COPY --from=builder /app/dist /usr/local/openresty/nginx/html

# Expose port 80
EXPOSE 80

# Use non-root user
RUN adduser -D -u 1000 appuser
USER appuser

# Start OpenResty
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]