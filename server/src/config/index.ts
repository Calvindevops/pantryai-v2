import dotenv from "dotenv";

// Load .env for local dev. On Railway/production, vars are injected by the platform.
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001", 10),
  apiUrl: process.env.API_URL || "http://localhost:3001",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "dev-jwt-secret",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  edamam: {
    appId: process.env.EDAMAM_APP_ID || "",
    appKey: process.env.EDAMAM_APP_KEY || "",
  },
  usdaApiKey: process.env.USDA_API_KEY || "",
  sentryDsn: process.env.SENTRY_DSN || "",
  isDev: (process.env.NODE_ENV || "development") === "development",
} as const;
