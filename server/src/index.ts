import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth.routes";
import scanRoutes from "./routes/scan.routes";
import pantryRoutes from "./routes/pantry.routes";
import recipeRoutes from "./routes/recipe.routes";
import cookRoutes from "./routes/cook.routes";
import mealplanRoutes from "./routes/mealplan.routes";
import nutritionRoutes from "./routes/nutrition.routes";
import groceryRoutes from "./routes/grocery.routes";
import socialRoutes from "./routes/social.routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [
      config.frontendUrl,
      "http://localhost:3000",
      "http://localhost:3002",
      "http://localhost:8081",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/cook", cookRoutes);
app.use("/api/meal-plan", mealplanRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/social", socialRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`PantryAI server running on port ${config.port}`);
});

export default app;
