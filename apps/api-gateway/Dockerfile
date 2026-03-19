FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
RUN npm install --workspace=apps/api-gateway
COPY apps/api-gateway ./apps/api-gateway
COPY shared ./shared
RUN npm run build --workspace=apps/api-gateway

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api-gateway/package.json ./
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
