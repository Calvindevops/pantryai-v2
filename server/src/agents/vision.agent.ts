import { visionCompletion, parseJson } from "../services/openai.service";

export interface DetectedItem {
  name: string;
  category: string;
  confidence: number;
  estimatedQuantity?: string;
}

interface ScanResult {
  items: DetectedItem[];
  stats: {
    totalItems: number;
    categories: Record<string, number>;
    healthScore: number;
    summary: string;
  };
}

const FRIDGE_SYSTEM = `You are PantryAI's vision system. Analyze this fridge/pantry photo and identify every visible food item.

Return ONLY valid JSON with this structure:
{
  "items": [
    { "name": "string", "category": "produce|dairy|protein|grain|condiment|beverage|other", "confidence": 0.0-1.0, "estimatedQuantity": "string" }
  ],
  "stats": {
    "totalItems": number,
    "categories": { "produce": count, ... },
    "healthScore": 1-10,
    "summary": "Brief analysis of fridge contents, freshness, variety"
  }
}

Be thorough — identify everything visible including items partially hidden. Estimate quantities realistically.`;

const ITEM_SYSTEM = `You are PantryAI's vision system. Identify this single food item.

Return ONLY valid JSON:
{
  "items": [
    { "name": "string", "category": "produce|dairy|protein|grain|condiment|beverage|other", "confidence": 0.0-1.0, "estimatedQuantity": "string" }
  ],
  "stats": { "totalItems": 1, "categories": {}, "healthScore": 5, "summary": "string" }
}`;

export const visionAgent = {
  async scanFridge(imageBuffer: Buffer): Promise<ScanResult> {
    const base64 = imageBuffer.toString("base64");
    const raw = await visionCompletion(FRIDGE_SYSTEM, base64);
    return parseJson<ScanResult>(raw);
  },

  async scanSingleItem(imageBuffer: Buffer): Promise<ScanResult> {
    const base64 = imageBuffer.toString("base64");
    const raw = await visionCompletion(ITEM_SYSTEM, base64);
    return parseJson<ScanResult>(raw);
  },
};
