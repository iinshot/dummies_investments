#build stage
ARG NODE_VERSION=24.14.0-alpine

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY ./fin-profi/package*.json ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the rest of the application source code into the container
COPY ./fin-profi .

# Build the React.js application (outputs to /app/dist)
RUN npm run build 

# =========================================
# Stage 2: Serve static files with Node.js + `serve`
# =========================================
FROM node:${NODE_VERSION} AS runner
 
 
# Set the environment to production for smaller + optimized installs
ENV NODE_ENV=production
 
 
# Set the working directory inside the container
WORKDIR /app
 
 
# Copy only the production build output from the builder stage
COPY --link --from=builder /app/dist ./dist
 
 
# Install only the `serve` package (no global install, pinned version)
RUN --mount=type=cache,target=/root/.npm npm install serve@^14.2.6 --omit=dev
 
 
# Run the container as a non-root user for security best practices
USER node
 
 
# Expose port 3000 (the same port configured in "serve -l 3000")
EXPOSE 3000
 
 
# Run `serve` directly to serve the built app
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
 
 
# Build Stage
FROM node:24-alpine AS build
WORKDIR /app
COPY ./fin-profi/package*.json ./
RUN npm install
COPY ./fin-profi .
RUN npm run build
  
# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]