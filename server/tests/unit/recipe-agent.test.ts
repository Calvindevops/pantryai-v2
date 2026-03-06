import { describe, it, expect, vi } from "vitest";

vi.mock("../../src/services/openai.service", () => ({
  chatCompletion: vi.fn().mockResolvedValue(
    JSON.stringify({
      title: "Simple Chicken Stir-Fry",
      description: "A quick stir-fry using pantry ingredients",
      cuisineType: "asian",
      skillLevel: "beginner",
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      servings: 2,
      calories: 450,
      protein: 35,
      carbs: 30,
      fat: 18,
      tags: ["quick", "high-protein"],
      ingredients: [
        { name: "Chicken Breast", quantity: 1, unit: "lb", isOptional: false },
        { name: "Rice", quantity: 1, unit: "cup", isOptional: false },
        { name: "Soy Sauce", quantity: 2, unit: "tbsp", isOptional: false },
      ],
      steps: [
        { instruction: "Cut the chicken into thin strips.", durationMin: 5, tip: "Use a sharp knife" },
        { instruction: "Cook the rice according to package directions.", durationMin: 15, tip: null },
        { instruction: "Stir-fry the chicken with soy sauce over high heat.", durationMin: 8, tip: "Don't overcrowd the pan" },
      ],
    })
  ),
  parseJson: vi.fn((raw: string) => JSON.parse(raw)),
}));

describe("recipeAgent", () => {
  it("generates a valid recipe structure", async () => {
    const { recipeAgent } = await import("../../src/agents/recipe.agent");

    const result = await recipeAgent.generate({
      ingredients: [
        { name: "Chicken Breast", quantity: 1, unit: "lb" },
        { name: "Rice", quantity: 2, unit: "cup" },
        { name: "Soy Sauce", quantity: 1, unit: "bottle" },
      ],
      skillLevel: "beginner",
      dietary: [],
      cuisines: ["asian"],
    });

    expect(result.title).toBeTruthy();
    expect(result.ingredients.length).toBeGreaterThan(0);
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.calories).toBeGreaterThan(0);
    expect(result.servings).toBeGreaterThan(0);
  });
});
