export const SKILL_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const INGREDIENT_CATEGORIES = [
  "produce", "dairy", "protein", "grain", "spice", "condiment", "beverage", "other",
] as const;
export type IngredientCategory = (typeof INGREDIENT_CATEGORIES)[number];

export const SCAN_TYPES = ["barcode", "single_item", "fridge"] as const;
export type ScanType = (typeof SCAN_TYPES)[number];

export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
