FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

RUN npm install

COPY . .

# Generate prisma client inside api workspace
RUN cd apps/api && npx prisma generate

RUN cd apps/api && npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app /app

EXPOSE 3000
CMD ["node", "apps/api/dist/main"]
