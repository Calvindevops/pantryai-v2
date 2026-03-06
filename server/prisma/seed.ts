import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const INGREDIENTS = [
  { name: "Chicken Breast", category: "protein", unit: "lb", shelfLifeDays: 3 },
  { name: "Ground Beef", category: "protein", unit: "lb", shelfLifeDays: 2 },
  { name: "Salmon Fillet", category: "protein", unit: "lb", shelfLifeDays: 2 },
  { name: "Eggs", category: "protein", unit: "dozen", shelfLifeDays: 21 },
  { name: "Tofu", category: "protein", unit: "block", shelfLifeDays: 7 },
  { name: "Rice", category: "grain", unit: "cup", shelfLifeDays: 365 },
  { name: "Pasta", category: "grain", unit: "lb", shelfLifeDays: 365 },
  { name: "Bread", category: "grain", unit: "loaf", shelfLifeDays: 7 },
  { name: "All-Purpose Flour", category: "grain", unit: "cup", shelfLifeDays: 180 },
  { name: "Milk", category: "dairy", unit: "gal", shelfLifeDays: 7 },
  { name: "Cheddar Cheese", category: "dairy", unit: "oz", shelfLifeDays: 30 },
  { name: "Butter", category: "dairy", unit: "stick", shelfLifeDays: 30 },
  { name: "Greek Yogurt", category: "dairy", unit: "cup", shelfLifeDays: 14 },
  { name: "Tomato", category: "produce", unit: "piece", shelfLifeDays: 7 },
  { name: "Onion", category: "produce", unit: "piece", shelfLifeDays: 30 },
  { name: "Garlic", category: "produce", unit: "clove", shelfLifeDays: 21 },
  { name: "Bell Pepper", category: "produce", unit: "piece", shelfLifeDays: 7 },
  { name: "Broccoli", category: "produce", unit: "head", shelfLifeDays: 5 },
  { name: "Spinach", category: "produce", unit: "bunch", shelfLifeDays: 5 },
  { name: "Carrot", category: "produce", unit: "piece", shelfLifeDays: 21 },
  { name: "Lemon", category: "produce", unit: "piece", shelfLifeDays: 14 },
  { name: "Avocado", category: "produce", unit: "piece", shelfLifeDays: 4 },
  { name: "Olive Oil", category: "condiment", unit: "tbsp", shelfLifeDays: 365 },
  { name: "Soy Sauce", category: "condiment", unit: "tbsp", shelfLifeDays: 365 },
  { name: "Hot Sauce", category: "condiment", unit: "tbsp", shelfLifeDays: 365 },
  { name: "Salt", category: "spice", unit: "tsp", shelfLifeDays: 1825 },
  { name: "Black Pepper", category: "spice", unit: "tsp", shelfLifeDays: 730 },
  { name: "Cumin", category: "spice", unit: "tsp", shelfLifeDays: 730 },
  { name: "Paprika", category: "spice", unit: "tsp", shelfLifeDays: 730 },
  { name: "Italian Seasoning", category: "spice", unit: "tsp", shelfLifeDays: 730 },
];

async function main() {
  console.log("Seeding database...");

  const ingredients = await Promise.all(
    INGREDIENTS.map((ing) =>
      prisma.ingredient.upsert({
        where: { name: ing.name },
        update: {},
        create: ing,
      })
    )
  );
  console.log(`  ${ingredients.length} ingredients`);

  const password = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@pantryai.com" },
    update: {},
    create: {
      email: "demo@pantryai.com",
      password,
      name: "Demo User",
      profile: {
        create: {
          skillLevel: "beginner",
          dietaryRestrictions: [],
          allergies: [],
          appliances: ["oven", "stovetop", "microwave"],
          cuisinePreferences: ["italian", "mexican", "asian"],
          calorieGoal: 2000,
          proteinGoal: 150,
          carbGoal: 200,
          fatGoal: 65,
          householdSize: 2,
        },
      },
    },
  });
  console.log(`  Demo user: ${user.email}`);

  const ingredientMap = new Map(ingredients.map((i) => [i.name, i.id]));
  const pantryNames = [
    "Chicken Breast", "Eggs", "Rice", "Milk", "Cheddar Cheese",
    "Tomato", "Onion", "Garlic", "Bell Pepper", "Spinach",
    "Olive Oil", "Salt", "Black Pepper",
  ];

  const now = new Date();
  await prisma.pantryItem.createMany({
    data: pantryNames.map((name, i) => ({
      userId: user.id,
      ingredientId: ingredientMap.get(name)!,
      quantity: Math.floor(Math.random() * 3) + 1,
      unit: INGREDIENTS.find((ing) => ing.name === name)!.unit,
      expiresAt: new Date(
        now.getTime() + (i < 5 ? 3 : 14) * 24 * 60 * 60 * 1000
      ),
      source: "manual",
    })),
    skipDuplicates: true,
  });
  console.log(`  ${pantryNames.length} pantry items`);

  const groceryList = await prisma.groceryList.create({
    data: {
      userId: user.id,
      name: "Weekly Groceries",
      items: {
        create: [
          { name: "Greek Yogurt", quantity: 2, unit: "cup" },
          { name: "Avocado", quantity: 4, unit: "piece" },
          { name: "Salmon Fillet", quantity: 1, unit: "lb" },
          { name: "Broccoli", quantity: 2, unit: "head" },
          { name: "Lemons", quantity: 3, unit: "piece" },
        ],
      },
    },
  });
  console.log(`  Grocery list: ${groceryList.name}`);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    d.setHours(12, 0, 0, 0);
    return d;
  });

  await prisma.nutritionLog.createMany({
    data: days.flatMap((date) => [
      { userId: user.id, date, mealType: "breakfast", label: "Eggs & Toast", calories: 350, protein: 18, carbs: 30, fat: 16 },
      { userId: user.id, date, mealType: "lunch", label: "Chicken Salad", calories: 520, protein: 38, carbs: 22, fat: 28 },
      { userId: user.id, date, mealType: "dinner", label: "Pasta Primavera", calories: 680, protein: 24, carbs: 72, fat: 26 },
    ]),
  });
  console.log(`  ${days.length * 3} nutrition logs`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
