import { describe, it, expect, vi, beforeAll } from "vitest";

vi.mock("../../src/lib/prisma", () => {
  const items = [
    {
      id: "item-1",
      userId: "user-1",
      ingredientId: "ing-1",
      quantity: 2,
      unit: "lb",
      expiresAt: new Date(Date.now() + 86400_000),
      addedAt: new Date(),
      source: "manual",
      ingredient: { id: "ing-1", name: "Chicken Breast", category: "protein", unit: "lb" },
    },
  ];

  return {
    prisma: {
      pantryItem: {
        findMany: vi.fn().mockResolvedValue(items),
        create: vi.fn().mockImplementation(({ data }) => ({
          id: "new-item",
          ...data,
          ingredient: { name: "Test", category: "other", unit: "unit" },
        })),
        update: vi.fn().mockImplementation(({ data }) => ({
          id: "item-1",
          ...items[0],
          ...data,
        })),
        delete: vi.fn().mockResolvedValue({}),
        createMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      ingredient: {
        findFirst: vi.fn().mockResolvedValue({
          id: "ing-1",
          name: "Chicken Breast",
          category: "protein",
          unit: "lb",
        }),
        create: vi.fn().mockResolvedValue({
          id: "ing-new",
          name: "New Item",
          category: "other",
          unit: "unit",
        }),
      },
    },
  };
});

vi.mock("../../src/middleware/auth", () => ({
  authMiddleware: (req: any, _res: any, next: any) => {
    req.user = { userId: "user-1", email: "test@test.com" };
    next();
  },
  signToken: () => "mock-token",
}));

describe("pantry routes", () => {
  it("module loads without errors", async () => {
    const mod = await import("../../src/routes/pantry.routes");
    expect(mod.default).toBeDefined();
  });
});
