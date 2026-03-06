import { Router, Request, Response } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: Request, res: Response) => {
  const { category, search } = req.query;
  const userId = req.user!.userId;

  const items = await prisma.pantryItem.findMany({
    where: {
      userId,
      ...(category ? { ingredient: { category: String(category) } } : {}),
      ...(search
        ? { ingredient: { name: { contains: String(search), mode: "insensitive" } } }
        : {}),
    },
    include: { ingredient: true },
    orderBy: { expiresAt: "asc" },
  });

  const now = new Date();
  const summary = {
    total: items.length,
    expiringSoon: items.filter(
      (i) => i.expiresAt && i.expiresAt.getTime() - now.getTime() < 3 * 24 * 3600_000
    ).length,
    categories: [...new Set(items.map((i) => i.ingredient.category))],
  };

  res.json({ items, summary });
});

const bulkAddSchema = z.array(
  z.object({
    name: z.string(),
    quantity: z.number().positive().default(1),
    unit: z.string().default("unit"),
    expiresInDays: z.number().optional(),
    source: z.enum(["manual", "scan", "grocery"]).default("manual"),
  })
);

router.post("/bulk", async (req: Request, res: Response) => {
  const items = bulkAddSchema.parse(req.body);
  const userId = req.user!.userId;
  const now = new Date();

  const created = await Promise.all(
    items.map(async (item) => {
      let ingredient = await prisma.ingredient.findFirst({
        where: { name: { equals: item.name, mode: "insensitive" } },
      });

      if (!ingredient) {
        ingredient = await prisma.ingredient.create({
          data: { name: item.name, category: "other", unit: item.unit },
        });
      }

      return prisma.pantryItem.create({
        data: {
          userId,
          ingredientId: ingredient.id,
          quantity: item.quantity,
          unit: item.unit,
          expiresAt: item.expiresInDays
            ? new Date(now.getTime() + item.expiresInDays * 86400_000)
            : null,
          source: item.source,
        },
        include: { ingredient: true },
      });
    })
  );

  res.status(201).json(created);
});

router.patch("/:id", async (req: Request, res: Response) => {
  const { quantity, expiresAt } = req.body;
  const item = await prisma.pantryItem.update({
    where: { id: req.params.id },
    data: {
      ...(quantity !== undefined ? { quantity } : {}),
      ...(expiresAt !== undefined ? { expiresAt: new Date(expiresAt) } : {}),
    },
    include: { ingredient: true },
  });
  res.json(item);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await prisma.pantryItem.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
