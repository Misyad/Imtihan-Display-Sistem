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

RUN apk add --no-cache tini

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Socket.IO server and ALL its dependencies
COPY --from=builder /app/server.js ./socket-server.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy built Next.js app (standalone mode)
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./standalone/.next/static

# Create startup script
RUN cat > /app/start.sh <<'EOF'
#!/bin/sh
set -e
echo "Starting Socket.IO server on port 3001..."
PORT=3001 node /app/socket-server.js &
SOCKET_PID=$!
echo "Socket.IO server started with PID $SOCKET_PID"

sleep 2
echo "Starting Next.js server on port 3000..."
cd /app/standalone
PORT=3000 exec node server.js
EOF

RUN chmod +x /app/start.sh
RUN chown nextjs:nodejs /app/start.sh

USER nextjs

EXPOSE 3000 3001

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/app/start.sh"]
