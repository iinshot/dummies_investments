# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем исходники
COPY . .

# Создаем vite.config.js
RUN cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true,
    },
  },
});
EOF

EXPOSE 3000

# Используем dev вместо start (для Vite)
CMD ["npm", "run", "dev"]

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
});
EOF

RUN npm run build

# Production stage
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist ./dist

RUN npm install serve@14.2.6 --omit=dev

USER node

EXPOSE 3000

CMD ["npx", "serve", "-s", "dist", "-l", "3000"]