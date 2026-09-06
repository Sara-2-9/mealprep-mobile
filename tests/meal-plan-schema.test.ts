import { describe, expect, test } from "bun:test";

import { MealPlanRequestSchema } from "../src/domain/meal-plan";

describe("MealPlanRequestSchema", () => {
  test("accepts the supported budget range", () => {
    expect(MealPlanRequestSchema.safeParse({ weeklyBudget: 25, dietaryNeeds: ["none"], nutritionalGoals: ["none"] }).success).toBe(true);
    expect(MealPlanRequestSchema.safeParse({ weeklyBudget: 150, dietaryNeeds: ["vegan"], nutritionalGoals: ["low-salt"] }).success).toBe(true);
  });

  test("rejects budgets outside the brief", () => {
    expect(MealPlanRequestSchema.safeParse({ weeklyBudget: 24, dietaryNeeds: [], nutritionalGoals: [] }).success).toBe(false);
    expect(MealPlanRequestSchema.safeParse({ weeklyBudget: 151, dietaryNeeds: [], nutritionalGoals: [] }).success).toBe(false);
  });
});

