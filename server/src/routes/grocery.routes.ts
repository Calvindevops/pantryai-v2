import { Router, Request, Response } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: Request, res: Response) => {
  const list = await prisma.groceryList.findFirst({
    where: { userId: req.user!.userId, isActive: true },
    include: { items: { orderBy: { checked: "asc" } } },
  });

  if (!list) return res.json(null);
  res.json(list);
});

const addItemSchema = z.object({
  name: z.string(),
  quantity: z.number().positive().default(1),
  unit: z.string().default("unit"),
  source: z.enum(["manual", "recipe", "meal_plan"]).default("manual"),
});

router.post("/items", async (req: Request, res: Response) => {
  const body = addItemSchema.parse(req.body);
  const userId = req.user!.userId;

  let list = await prisma.groceryList.findFirst({
    where: { userId, isActive: true },
  });

  if (!list) {
    list = await prisma.groceryList.create({ data: { userId } });
  }

  const item = await prisma.groceryListItem.create({
    data: { groceryListId: list.id, ...body },
  });
  res.status(201).json(item);
});

router.post("/items/bulk", async (req: Request, res: Response) => {
  const items = z.array(addItemSchema).parse(req.body);
  const userId = req.user!.userId;

  let list = await prisma.groceryList.findFirst({
    where: { userId, isActive: true },
  });
  if (!list) {
    list = await prisma.groceryList.create({ data: { userId } });
  }

  const created = await prisma.groceryListItem.createMany({
    data: items.map((item) => ({ groceryListId: list!.id, ...item })),
  });
  res.status(201).json({ count: created.count });
});

router.patch("/items/:id", async (req: Request, res: Response) => {
  const { checked, quantity } = req.body;
  const item = await prisma.groceryListItem.update({
    where: { id: req.params.id },
    data: {
      ...(checked !== undefined ? { checked } : {}),
      ...(quantity !== undefined ? { quantity } : {}),
    },
  });
  res.json(item);
});

router.delete("/items/:id", async (req: Request, res: Response) => {
  await prisma.groceryListItem.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

export default router;
