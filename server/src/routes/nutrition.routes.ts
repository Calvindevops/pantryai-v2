import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();
router.use(authMiddleware);

router.get("/daily", async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const dateStr = String(req.query.date || new Date().toISOString().slice(0, 10));
  const dayStart = new Date(dateStr + "T00:00:00Z");
  const dayEnd = new Date(dateStr + "T23:59:59Z");

  const logs = await prisma.nutritionLog.findMany({
    where: { userId, date: { gte: dayStart, lte: dayEnd } },
    orderBy: { date: "asc" },
  });

  const totals = logs.reduce(
    (acc, l) => ({
      calories: acc.calories + l.calories,
      protein: acc.protein + l.protein,
      carbs: acc.carbs + l.carbs,
      fat: acc.fat + l.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  const goals = {
    calories: profile?.calorieGoal || 2000,
    protein: profile?.proteinGoal || 150,
    carbs: profile?.carbGoal || 200,
    fat: profile?.fatGoal || 65,
  };

  res.json({ date: dateStr, logs, totals, goals });
});

router.get("/weekly", async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const logs = await prisma.nutritionLog.findMany({
    where: { userId, date: { gte: weekStart } },
    orderBy: { date: "asc" },
  });

  const dayMap = new Map<string, { calories: number; protein: number; carbs: number; fat: number }>();
  for (const log of logs) {
    const key = log.date.toISOString().slice(0, 10);
    const prev = dayMap.get(key) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
    dayMap.set(key, {
      calories: prev.calories + log.calories,
      protein: prev.protein + log.protein,
      carbs: prev.carbs + log.carbs,
      fat: prev.fat + log.fat,
    });
  }

  const days = Array.from(dayMap.entries()).map(([date, totals]) => ({
    date,
    ...totals,
  }));

  res.json({ days });
});

export default router;
