import { z } from "zod";

import { dietaryNeeds, nutritionalGoals } from "./preferences";

const dietaryNeedIds = dietaryNeeds.map((item) => item.id) as [
  (typeof dietaryNeeds)[number]["id"],
  ...(typeof dietaryNeeds)[number]["id"][],
];
const nutritionalGoalIds = nutritionalGoals.map((item) => item.id) as [
  (typeof nutritionalGoals)[number]["id"],
  ...(typeof nutritionalGoals)[number]["id"][],
];

export const MealPlanRequestSchema = z.object({
  weeklyBudget: z.number().min(25).max(150),
  dietaryNeeds: z.array(z.enum(dietaryNeedIds)),
  nutritionalGoals: z.array(z.enum(nutritionalGoalIds)),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  department: z.string(),
  price: z.number().nonnegative(),
  currency: z.literal("EUR"),
  labels: z.array(z.string()),
  allergens: z.array(z.string()),
  nutrition: z.object({
    energyKcal100g: z.number().nullable(),
    fat100g: z.number().nullable(),
    saturatedFat100g: z.number().nullable(),
    carbohydrates100g: z.number().nullable(),
    sugars100g: z.number().nullable(),
    fiber100g: z.number().nullable(),
    proteins100g: z.number().nullable(),
    salt100g: z.number().nullable(),
  }),
});

export const MealDraftSchema = z.object({
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  name: z.string().min(3).max(80),
  prepMinutes: z.number().int().min(5).max(180),
  servings: z.number().int().min(1).max(8),
  productIds: z.array(z.string()).min(2).max(10),
  ingredients: z.array(
    z.object({
      productId: z.string(),
      quantity: z.string().min(1).max(80),
    }),
  ),
  steps: z.array(z.string().min(5).max(300)).min(2).max(10),
});

export const MealPlanDraftSchema = z.object({
  meals: z.array(MealDraftSchema).length(7),
});

export const MealSchema = MealDraftSchema.extend({
  ingredients: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      quantity: z.string(),
    }),
  ),
  pricePerServing: z.number().nonnegative(),
});

export const MealPlanSchema = z.object({
  estimatedCost: z.number().nonnegative(),
  currency: z.literal("EUR"),
  meals: z.array(MealSchema).length(7),
});

export type MealPlanRequest = z.infer<typeof MealPlanRequestSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type MealPlanDraft = z.infer<typeof MealPlanDraftSchema>;
export type MealPlan = z.infer<typeof MealPlanSchema>;
