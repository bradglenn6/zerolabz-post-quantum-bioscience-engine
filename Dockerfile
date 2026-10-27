FROM node:20-bookworm-slim
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY server.ts ./
COPY registration-result.json ./
COPY src/ ./src/

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

CMD ["npx", "tsx", "server.ts"]
