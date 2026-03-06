import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();
router.use(authMiddleware);

router.post("/generate", async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const [pantryItems, profile] = await Promise.all([
    prisma.pantryItem.findMany({
      where: { userId },
      include: { ingredient: true },
    }),
    prisma.userProfile.findUnique({ where: { userId } }),
  ]);

  const { plannerAgent } = await import("../agents/planner.agent");
  const plan = await plannerAgent.generateWeeklyPlan({
    ingredients: pantryItems.map((p) => ({
      name: p.ingredient.name,
      quantity: p.quantity,
      unit: p.unit,
    })),
    profile: profile || undefined,
  });

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const savedPlan = await prisma.mealPlan.create({
    data: {
      userId,
      weekStart,
      weekEnd,
      items: {
        create: plan.meals.map((m: any) => ({
          recipeId: m.recipeId,
          dayOfWeek: m.dayOfWeek,
          mealType: m.mealType,
        })),
      },
    },
    include: { items: { include: { recipe: true } } },
  });

  res.status(201).json({ plan: savedPlan, grocerySuggestions: plan.grocerySuggestions });
});

router.get("/current", async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const plan = await prisma.mealPlan.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { recipe: true },
        orderBy: [{ dayOfWeek: "asc" }, { mealType: "asc" }],
      },
    },
  });

  if (!plan) return res.json(null);
  res.json(plan);
});

router.patch("/:id/items/:itemId", async (req: Request, res: Response) => {
  const { recipeId, dayOfWeek, mealType } = req.body;
  const item = await prisma.mealPlanItem.update({
    where: { id: req.params.itemId },
    data: {
      ...(recipeId ? { recipeId } : {}),
      ...(dayOfWeek !== undefined ? { dayOfWeek } : {}),
      ...(mealType ? { mealType } : {}),
    },
    include: { recipe: true },
  });
  res.json(item);
});

export default router;
