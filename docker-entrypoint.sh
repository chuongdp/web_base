#!/bin/sh
set -e

mkdir -p /data
chown -R nextjs:nodejs /data 2>/dev/null || true

export DATABASE_URL="${DATABASE_URL:-file:/data/app.db}"

su-exec nextjs npx prisma db push
exec su-exec nextjs node server.js
