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
RUN printf '#!/bin/sh\n\
set -e\n\
echo "Starting Socket.IO server on port 3001..."\n\
PORT=3001 node /app/socket-server.js &\n\
SOCKET_PID=\$\!\n\
echo "Socket.IO server started with PID \$SOCKET_PID"\n\
sleep 2\n\
echo "Starting Next.js server on port 3000..."\n\
cd /app/standalone\n\
PORT=3000 exec node server.js\n\
' > /app/start.sh

RUN chmod +x /app/start.sh
RUN chown nextjs:nodejs /app/start.sh

USER nextjs

EXPOSE 3000 3001

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/app/start.sh"]
