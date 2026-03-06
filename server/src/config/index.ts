import dotenv from "dotenv";

// Only load .env file in local development.
// On Railway/Vercel, environment variables are injected by the platform directly.
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const isProd = process.env.NODE_ENV === "production";

// Validate required production secrets at startup so Railway fails fast
// with a clear message rather than silently using wrong values.
if (isProd) {
  const required = ["DATABASE_URL", "JWT_SECRET", "OPENAI_API_KEY"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`[config] Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001", 10),
  // Non-sensitive defaults baked in — overridden by Railway env vars in production
  apiUrl: process.env.API_URL || "https://pantryai-production-4402.up.railway.app",
  frontendUrl: process.env.FRONTEND_URL || "https://web-seven-rho-32.vercel.app",
  jwtSecret: process.env.JWT_SECRET || "dev-jwt-secret-change-in-production",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  edamam: {
    appId: process.env.EDAMAM_APP_ID || "",
    appKey: process.env.EDAMAM_APP_KEY || "",
  },
  usdaApiKey: process.env.USDA_API_KEY || "",
  sentryDsn: process.env.SENTRY_DSN || "",
  isDev: (process.env.NODE_ENV || "development") === "development",
} as const;
