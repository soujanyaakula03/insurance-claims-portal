FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace config
COPY package.json ./
COPY apps/users-service/package.json ./apps/users-service/

# Install dependencies
RUN npm install --workspace=apps/users-service

# Copy source
COPY apps/users-service ./apps/users-service
COPY shared ./shared

# Build
RUN npm run build --workspace=apps/users-service

# ─── Production image ───────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/users-service/package.json ./
COPY --from=builder /app/apps/users-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3002

CMD ["node", "dist/index.js"]
