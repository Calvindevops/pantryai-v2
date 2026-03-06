import { chatCompletion, parseJson } from "../services/openai.service";

interface PlanInput {
  ingredients: { name: string; quantity: number; unit: string }[];
  profile?: {
    skillLevel?: string;
    dietaryRestrictions?: string[];
    calorieGoal?: number | null;
    proteinGoal?: number | null;
    cuisinePreferences?: string[];
    householdSize?: number;
  };
}

interface MealSlot {
  recipeId: string;
  dayOfWeek: number;
  mealType: string;
  title: string;
}

interface WeeklyPlan {
  meals: MealSlot[];
  grocerySuggestions: { name: string; quantity: number; unit: string }[];
}

const SYSTEM = `You are PantryAI's meal planner. Generate a 7-day meal plan that:
1. Prioritizes using existing pantry ingredients before they expire
2. Meets the user's calorie/macro goals
3. Provides variety across cuisines and meal types
4. Stays within skill level
5. Respects dietary restrictions

Return ONLY valid JSON:
{
  "meals": [
    {
      "recipeId": "" (leave empty, will be filled later),
      "dayOfWeek": 0-6 (0=Mon),
      "mealType": "breakfast|lunch|dinner|snack",
      "title": "Recipe name"
    }
  ],
  "grocerySuggestions": [
    { "name": "string", "quantity": number, "unit": "string" }
  ]
}

Plan 3 meals per day (breakfast, lunch, dinner) for 7 days = 21 meals.
grocerySuggestions should list items NOT in the pantry that the plan needs.`;

export const plannerAgent = {
  async generateWeeklyPlan(input: PlanInput): Promise<WeeklyPlan> {
    const ingredientList = input.ingredients
      .map((i) => `${i.quantity} ${i.unit} ${i.name}`)
      .join(", ");

    const profile = input.profile;
    const userMsg = [
      `Pantry ingredients: ${ingredientList}`,
      profile?.skillLevel ? `Skill: ${profile.skillLevel}` : "",
      profile?.dietaryRestrictions?.length
        ? `Dietary: ${profile.dietaryRestrictions.join(", ")}`
        : "",
      profile?.calorieGoal ? `Daily calorie target: ${profile.calorieGoal}` : "",
      profile?.proteinGoal ? `Daily protein target: ${profile.proteinGoal}g` : "",
      profile?.cuisinePreferences?.length
        ? `Preferred cuisines: ${profile.cuisinePreferences.join(", ")}`
        : "",
      profile?.householdSize ? `Household size: ${profile.householdSize}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const raw = await chatCompletion(SYSTEM, userMsg);
    return parseJson<WeeklyPlan>(raw);
  },
};
