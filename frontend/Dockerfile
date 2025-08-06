# build stage
FROM node:22-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM node:22-alpine
WORKDIR /app

# Copy built assets and necessary files
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/package.json ./
COPY --from=build-stage /app/package-lock.json ./

# Install serve
RUN npm install serve

EXPOSE 80

# Start server with serve, -s for SPA mode
CMD ["npx", "serve", "-s", "dist", "-l", "80"]