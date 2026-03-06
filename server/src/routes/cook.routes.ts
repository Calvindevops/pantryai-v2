import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();
router.use(authMiddleware);

router.post("/start", async (req: Request, res: Response) => {
  const { recipeId } = req.body;
  if (!recipeId) return res.status(400).json({ error: "recipeId required" });

  const session = await prisma.cookingSession.create({
    data: { userId: req.user!.userId, recipeId },
    include: { recipe: { include: { steps: { orderBy: { stepNumber: "asc" } } } } },
  });

  res.status(201).json(session);
});

router.patch("/:id/step", async (req: Request, res: Response) => {
  const { currentStep } = req.body;
  const session = await prisma.cookingSession.update({
    where: { id: req.params.id },
    data: { currentStep },
    include: { recipe: { include: { steps: { orderBy: { stepNumber: "asc" } } } } },
  });
  res.json(session);
});

router.post("/:id/complete", async (req: Request, res: Response) => {
  const session = await prisma.cookingSession.update({
    where: { id: req.params.id },
    data: { status: "completed", completedAt: new Date() },
    include: { recipe: true },
  });

  if (session.recipe.calories) {
    await prisma.nutritionLog.create({
      data: {
        userId: session.userId,
        mealType: "dinner",
        label: session.recipe.title,
        calories: session.recipe.calories,
        protein: session.recipe.protein || 0,
        carbs: session.recipe.carbs || 0,
        fat: session.recipe.fat || 0,
        source: "cook_session",
      },
    });
  }

  const { amiAgent } = await import("../agents/ami.agent");
  await amiAgent.recordEvent(session.userId, "recipe_cooked", {
    recipeId: session.recipeId,
    title: session.recipe.title,
  });

  res.json(session);
});

export default router;
