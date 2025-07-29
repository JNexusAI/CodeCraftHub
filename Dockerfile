# ---- Stage 1: Build Stage ----
# Use an official Node.js image as a builder
FROM node:20-alpine AS builder

# Create and set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using npm ci for consistency
RUN npm ci

# Copy the rest of the application source code
COPY . .

# ---- Stage 2: Production Stage ----
# Use a fresh, slim Node.js image for the final product
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Create a non-root user and group for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies and source code from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./server.js

# Switch to the non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 5050

# Define the command to start the app
CMD ["node", "server.js"]