import { config } from "../config";
import { logger } from "../utils/logger";

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export async function lookupNutrition(query: string): Promise<NutritionData> {
  // Edamam (primary)
  if (config.edamam.appId && config.edamam.appKey) {
    try {
      const url = `https://api.edamam.com/api/nutrition-data?app_id=${config.edamam.appId}&app_key=${config.edamam.appKey}&ingr=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data: any = await res.json();
        if (data.totalNutrients) {
          return {
            calories: Math.round(data.calories || 0),
            protein: Math.round(data.totalNutrients.PROCNT?.quantity || 0),
            carbs: Math.round(data.totalNutrients.CHOCDF?.quantity || 0),
            fat: Math.round(data.totalNutrients.FAT?.quantity || 0),
            fiber: Math.round(data.totalNutrients.FIBTG?.quantity || 0),
          };
        }
      }
    } catch (err: any) {
      logger.warn("Edamam lookup failed:", err.message);
    }
  }

  // USDA (fallback)
  if (config.usdaApiKey) {
    try {
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${config.usdaApiKey}&pageSize=1`;
      const res = await fetch(url);
      if (res.ok) {
        const data: any = await res.json();
        const food = data.foods?.[0];
        if (food) {
          const get = (id: number) =>
            food.foodNutrients?.find((n: any) => n.nutrientId === id)?.value || 0;
          return {
            calories: Math.round(get(1008)),
            protein: Math.round(get(1003)),
            carbs: Math.round(get(1005)),
            fat: Math.round(get(1004)),
            fiber: Math.round(get(1079)),
          };
        }
      }
    } catch (err: any) {
      logger.warn("USDA lookup failed:", err.message);
    }
  }

  logger.warn("No nutrition data found for:", query);
  return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
}
