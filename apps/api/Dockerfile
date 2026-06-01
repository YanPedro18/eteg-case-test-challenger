# ── Build stage ─────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN npm ci
RUN npm run build --workspace=@john-doe/api

# ── Runtime stage ────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Run migrations then start server
COPY apps/api/src/config/migrate.ts ./src/config/migrate.ts

EXPOSE 3001

CMD ["node", "dist/server.js"]
