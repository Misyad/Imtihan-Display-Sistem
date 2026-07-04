# Multi-stage build for Next.js + Socket.IO server
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built Next.js app (standalone mode)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Socket.IO server and its dependencies
COPY --from=builder --chown=nextjs:nodejs /app/server.js ./socket-server.js
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000 3001

# Start Socket.IO server in background, then Next.js standalone server in foreground
CMD ["sh", "-c", "node socket-server.js & exec node server.js"]
