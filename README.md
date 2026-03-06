# PantryAI

AI-powered cooking assistant that turns your fridge into personalized meals.

## Quick Start

### Prerequisites

- Node.js 20+
- Docker (for Postgres) or a Postgres 16+ instance
- OpenAI API key

### 1. Environment

```bash
cp .env.example .env
# Fill in your API keys in .env
```

### 2. Start Postgres

```bash
docker compose up -d
```

### 3. Server

```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev        # http://localhost:3001
```

### 4. Web App

```bash
cd apps/web
npm install
npm run dev        # http://localhost:3000
```

### 5. Mobile App

```bash
cd apps/mobile
npm install
npx expo start
```

## Architecture

```
pantryai/
  server/          Express + Prisma + AI agents
  apps/web/        Next.js 14 web frontend
  apps/mobile/     Expo React Native app
  packages/shared/ Shared types and constants
```

## Deployment

- **Web** → Vercel (connect `apps/web/`)
- **API** → Railway or Fly.io (point to `server/`)
- **DB** → Supabase or any managed Postgres

Set the environment variables from `.env.example` in each platform's dashboard.
