# Stage 1: Build Environment
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# 1. Install required C++ build tools for node-gyp, ffi-napi, and liboqs
RUN apt-get update && apt-get install -y python3 make g++ cmake git && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# 2. Strip devDependencies to shrink the production image size
RUN npm prune --omit=dev --legacy-peer-deps

# Stage 2: Production Runtime
FROM node:20-bookworm-slim
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
# 3. Copy only the compiled production node_modules, assets, and BioIP receipts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/registration-result.json ./registration-result.json

EXPOSE 8080
CMD ["node", "dist/server.js"]
