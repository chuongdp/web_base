#!/bin/sh
set -e

mkdir -p /data
chown -R nextjs:nodejs /data 2>/dev/null || true

mkdir -p /app/public/uploads
chown -R nextjs:nodejs /app/public/uploads 2>/dev/null || true

# ISR / prerender cache (Next.js ghi runtime) — tránh EACCES nếu layer .next không đúng owner
mkdir -p /app/.next/cache
chown -R nextjs:nodejs /app/.next /app/public 2>/dev/null || true

export DATABASE_URL="${DATABASE_URL:-file:/data/app.db}"

su-exec nextjs node /opt/prisma-cli/node_modules/prisma/build/index.js db push --skip-generate
exec su-exec nextjs node server.js
