import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("nutrition-api.service", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.EDAMAM_APP_ID = "";
    process.env.EDAMAM_APP_KEY = "";
    process.env.USDA_API_KEY = "";
  });

  it("returns zeroes when no API keys are configured", async () => {
    const { lookupNutrition } = await import(
      "../../src/services/nutrition-api.service"
    );

    const result = await lookupNutrition("chicken breast 100g");

    expect(result).toEqual({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    });
  });
});
