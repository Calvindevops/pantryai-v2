import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/challenge/:code", async (req: Request, res: Response) => {
  const challenge = await prisma.fridgeChallenge.findUnique({
    where: { shareCode: req.params.code },
    include: { user: { select: { name: true, avatarUrl: true } } },
  });

  if (!challenge) return res.status(404).json({ error: "Challenge not found" });

  res.json({
    id: challenge.id,
    itemCount: challenge.itemCount,
    topItems: challenge.topItems,
    stats: challenge.stats,
    imageUrl: challenge.imageUrl,
    createdAt: challenge.createdAt,
    user: challenge.user,
  });
});

export default router;
