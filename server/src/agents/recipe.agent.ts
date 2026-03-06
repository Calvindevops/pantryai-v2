import { chatCompletion, parseJson } from "../services/openai.service";

interface GenerateInput {
  ingredients: { name: string; quantity: number; unit: string }[];
  skillLevel: string;
  dietary: string[];
  cuisines: string[];
  preferences?: Record<string, number>;
}

interface GeneratedRecipe {
  title: string;
  description: string;
  cuisineType: string;
  skillLevel: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    isOptional: boolean;
  }[];
  steps: {
    instruction: string;
    durationMin: number | null;
    tip: string | null;
  }[];
}

const SYSTEM = `You are PantryAI's recipe generator. Create a recipe that:
1. Uses primarily the ingredients the user already has
2. Matches their cooking skill level
3. Respects dietary restrictions
4. Accounts for cuisine preferences and learned taste preferences

Return ONLY valid JSON matching this schema:
{
  "title": "string",
  "description": "string",
  "cuisineType": "string",
  "skillLevel": "beginner|intermediate|advanced",
  "prepTimeMinutes": number,
  "cookTimeMinutes": number,
  "servings": number,
  "calories": number (estimate per serving),
  "protein": number,
  "carbs": number,
  "fat": number,
  "tags": ["string"],
  "ingredients": [
    { "name": "string", "quantity": number, "unit": "string", "isOptional": boolean }
  ],
  "steps": [
    { "instruction": "string (clear, beginner-friendly)", "durationMin": number|null, "tip": "string|null" }
  ]
}

Make steps concise but detailed enough for a beginner. Include helpful tips where useful.
Nutrition estimates should be realistic per-serving values.`;

export const recipeAgent = {
  async generate(input: GenerateInput): Promise<GeneratedRecipe> {
    const ingredientList = input.ingredients
      .map((i) => `${i.quantity} ${i.unit} ${i.name}`)
      .join(", ");

    const userMsg = [
      `Available ingredients: ${ingredientList}`,
      `Skill level: ${input.skillLevel}`,
      input.dietary.length ? `Dietary restrictions: ${input.dietary.join(", ")}` : "",
      input.cuisines.length ? `Cuisine preferences: ${input.cuisines.join(", ")}` : "",
      input.preferences
        ? `Taste profile (higher = preferred): ${JSON.stringify(input.preferences)}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const raw = await chatCompletion(SYSTEM, userMsg);
    return parseJson<GeneratedRecipe>(raw);
  },
};
