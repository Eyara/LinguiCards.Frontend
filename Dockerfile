# syntax=docker/dockerfile:1.4

# Build stage
FROM node:18-alpine as builder
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prod

# Production stage
FROM openresty/openresty:1.21.4.1-alpine
LABEL package="Lingui.Cards.Frontend"

# Remove default nginx static assets
RUN rm -rf /usr/local/openresty/nginx/html/*

# Install git if needed
RUN apk add --no-cache git

# Create necessary directories and set permissions
RUN mkdir -p /var/run/openresty \
    && mkdir -p /usr/local/openresty/nginx/logs \
    && mkdir -p /var/cache/nginx \
    && chown -R nobody:nobody /var/run/openresty \
    && chown -R nobody:nobody /usr/local/openresty/nginx \
    && chown -R nobody:nobody /var/cache/nginx \
    && chmod -R 755 /var/run/openresty \
    && chmod -R 755 /usr/local/openresty/nginx \
    && chmod -R 755 /var/cache/nginx

# Copy static assets from builder stage
COPY --from=builder /src/dist /usr/local/openresty/nginx/html

# Expose port 80
EXPOSE 80

# Use nobody user
USER nobody

# Start OpenResty
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]