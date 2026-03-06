import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { prisma } from "../lib/prisma";
import { v4 as uuid } from "uuid";

const router = Router();

router.post("/barcode", authMiddleware, async (req: Request, res: Response) => {
  const { barcode } = req.body;
  if (!barcode) return res.status(400).json({ error: "barcode required" });

  // Open Food Facts lookup
  const resp = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
  );
  const data: any = await resp.json();
  if (data.status !== 1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const product = {
    name: data.product.product_name || "Unknown",
    brand: data.product.brands || "",
    nutrients: data.product.nutriments || {},
    imageUrl: data.product.image_url || null,
  };

  await prisma.scanHistory.create({
    data: {
      userId: req.user!.userId,
      scanType: "barcode",
      result: product as any,
    },
  });

  res.json(product);
});

router.post(
  "/item",
  authMiddleware,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer) return res.status(400).json({ error: "Image required" });

    // Delegate to VisionAgent (imported dynamically to avoid circular deps during startup)
    const { visionAgent } = await import("../agents/vision.agent");
    const result = await visionAgent.scanSingleItem(imageBuffer);

    await prisma.scanHistory.create({
      data: {
        userId: req.user!.userId,
        scanType: "single_item",
        result: result as any,
      },
    });

    res.json(result);
  }
);

router.post(
  "/fridge",
  authMiddleware,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer) return res.status(400).json({ error: "Image required" });

    const { visionAgent } = await import("../agents/vision.agent");
    const result = await visionAgent.scanFridge(imageBuffer);

    await prisma.scanHistory.create({
      data: {
        userId: req.user!.userId,
        scanType: "fridge",
        result: result as any,
      },
    });

    const shareCode = uuid().slice(0, 8);
    const challenge = await prisma.fridgeChallenge.create({
      data: {
        userId: req.user!.userId,
        shareCode,
        itemCount: result.items.length,
        topItems: result.items.slice(0, 5).map((i: any) => i.name),
        stats: result.stats as any,
      },
    });

    res.json({ ...result, challenge: { shareCode: challenge.shareCode, id: challenge.id } });
  }
);

export default router;
