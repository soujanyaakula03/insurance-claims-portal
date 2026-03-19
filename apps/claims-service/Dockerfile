FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY apps/claims-service/package.json ./apps/claims-service/
RUN npm install --workspace=apps/claims-service
COPY apps/claims-service ./apps/claims-service
COPY shared ./shared
RUN npm run build --workspace=apps/claims-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/claims-service/package.json ./
COPY --from=builder /app/apps/claims-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/index.js"]
