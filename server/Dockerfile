FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of source and compile TypeScript
COPY . .
RUN npx tsc

# ── Production image ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Only copy production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy Prisma client and compiled output from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/index.js"]
