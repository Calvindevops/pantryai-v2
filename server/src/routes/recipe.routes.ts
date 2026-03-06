import { Router, Request, Response } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();
router.use(authMiddleware);

router.post("/generate", async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const pantryItems = await prisma.pantryItem.findMany({
    where: { userId },
    include: { ingredient: true },
  });
  const profile = await prisma.userProfile.findUnique({ where: { userId } });

  const { recipeAgent } = await import("../agents/recipe.agent");
  const { amiAgent } = await import("../agents/ami.agent");

  const preferences = await amiAgent.getPreferences(userId);
  const generated = await recipeAgent.generate({
    ingredients: pantryItems.map((p) => ({
      name: p.ingredient.name,
      quantity: p.quantity,
      unit: p.unit,
    })),
    skillLevel: profile?.skillLevel || "beginner",
    dietary: profile?.dietaryRestrictions || [],
    cuisines: profile?.cuisinePreferences || [],
    preferences,
  });

  const recipe = await prisma.recipe.create({
    data: {
      creatorId: userId,
      title: generated.title,
      description: generated.description,
      cuisineType: generated.cuisineType,
      skillLevel: generated.skillLevel,
      prepTimeMinutes: generated.prepTimeMinutes,
      cookTimeMinutes: generated.cookTimeMinutes,
      servings: generated.servings,
      calories: generated.calories,
      protein: generated.protein,
      carbs: generated.carbs,
      fat: generated.fat,
      tags: generated.tags || [],
      isAiGenerated: true,
      ingredients: {
        create: await Promise.all(
          generated.ingredients.map(async (ing: any) => {
            let ingredient = await prisma.ingredient.findFirst({
              where: { name: { equals: ing.name, mode: "insensitive" } },
            });
            if (!ingredient) {
              ingredient = await prisma.ingredient.create({
                data: { name: ing.name, category: "other", unit: ing.unit },
              });
            }
            return {
              ingredientId: ingredient.id,
              quantity: ing.quantity,
              unit: ing.unit,
              isOptional: ing.isOptional || false,
            };
          })
        ),
      },
      steps: {
        create: generated.steps.map((s: any, i: number) => ({
          stepNumber: i + 1,
          instruction: s.instruction,
          durationMin: s.durationMin || null,
          tip: s.tip || null,
        })),
      },
    },
    include: { ingredients: { include: { ingredient: true } }, steps: true },
  });

  await amiAgent.recordEvent(userId, "recipe_viewed", { recipeId: recipe.id });

  res.status(201).json(recipe);
});

router.get("/", async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { page = "1", limit = "12", cuisine, skill } = req.query;
  const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

  const where: any = { creatorId: userId };
  if (cuisine) where.cuisineType = String(cuisine);
  if (skill) where.skillLevel = String(skill);

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: { ingredients: { include: { ingredient: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(String(limit)),
    }),
    prisma.recipe.count({ where }),
  ]);

  res.json({ recipes, total, page: parseInt(String(page)) });
});

router.get("/:id", async (req: Request, res: Response) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: req.params.id },
    include: {
      ingredients: { include: { ingredient: true } },
      steps: { orderBy: { stepNumber: "asc" } },
    },
  });

  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  res.json(recipe);
});

router.post("/:id/save", async (req: Request, res: Response) => {
  const saved = await prisma.userRecipe.upsert({
    where: {
      userId_recipeId: { userId: req.user!.userId, recipeId: req.params.id },
    },
    create: { userId: req.user!.userId, recipeId: req.params.id },
    update: {},
  });
  res.json(saved);
});

export default router;
