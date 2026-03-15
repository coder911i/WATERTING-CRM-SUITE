# 🐳 Dockerfile for NestJS backend (apps/api)

FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root configuration
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

# Install dependencies (utilizing workspace caches)
RUN npm install

# Copy the actual API source code
COPY apps/api ./apps/api

# Run build 
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

# --- Production Image ---
FROM node:20-alpine AS runner

WORKDIR /app

# Copy ONLY built files and node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Copy Prisma schema for migrations at runtime triggers
COPY --from=builder /app/apps/api/src/prisma ./apps/api/src/prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "apps/api/dist/main.js"]
