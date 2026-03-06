import { prisma } from "../lib/prisma";
import { logger } from "../utils/logger";

/**
 * AMI — Adaptive Memory Intelligence
 * Tracks user behavior events and computes taste/preference profiles.
 */
export const amiAgent = {
  async recordEvent(
    userId: string,
    eventType: string,
    payload: Record<string, any>
  ): Promise<void> {
    try {
      await prisma.amiEvent.create({
        data: { userId, eventType, payload },
      });
    } catch (err: any) {
      logger.error("AMI recordEvent error:", err.message);
    }
  },

  async getPreferences(userId: string): Promise<Record<string, number>> {
    const events = await prisma.amiEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const scores: Record<string, number> = {};

    for (const event of events) {
      const payload = event.payload as Record<string, any>;

      switch (event.eventType) {
        case "recipe_cooked": {
          // Cooking a recipe is the strongest positive signal
          const title = payload.title || "";
          extractKeywords(title).forEach((kw) => {
            scores[kw] = (scores[kw] || 0) + 3;
          });
          break;
        }
        case "recipe_viewed": {
          // Viewing shows interest
          const title = payload.title || "";
          extractKeywords(title).forEach((kw) => {
            scores[kw] = (scores[kw] || 0) + 1;
          });
          break;
        }
        case "ingredient_liked": {
          const name = payload.name || "";
          scores[name.toLowerCase()] = (scores[name.toLowerCase()] || 0) + 2;
          break;
        }
        case "ingredient_disliked": {
          const name = payload.name || "";
          scores[name.toLowerCase()] = (scores[name.toLowerCase()] || 0) - 3;
          break;
        }
        case "cuisine_chosen": {
          const cuisine = payload.cuisine || "";
          scores[cuisine.toLowerCase()] = (scores[cuisine.toLowerCase()] || 0) + 2;
          break;
        }
      }
    }

    return scores;
  },
};

function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    "a", "an", "the", "with", "and", "or", "in", "on", "of", "for", "to",
  ]);
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
}
