import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import {
  MealPlanDraftSchema,
  MealPlanRequestSchema,
  MealPlanSchema,
  type MealPlan,
} from "../src/domain/meal-plan";

import { selectCandidateProducts } from "./catalog";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export async function generateMealPlan(payload: unknown): Promise<MealPlan> {
  const input = MealPlanRequestSchema.parse(payload);
  const apiKey = Bun.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured on the Bun server.");

  const products = selectCandidateProducts(input);
  const compactProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    department: product.department,
    price: product.price,
    allergens: product.allergens,
    labels: product.labels,
    nutrition: product.nutrition,
  }));

  const client = new OpenAI({ apiKey });
  const response = await client.responses.parse({
    model: Bun.env.OPENAI_MODEL ?? "gpt-5-mini",
    instructions: [
      "You are a pragmatic meal planner using only the supplied grocery catalog.",
      "Return exactly one dinner for each day Monday through Sunday.",
      "Use only exact product IDs from the candidate list and reuse products across meals to reduce waste.",
      "The sum of prices for unique product IDs across the whole week must not exceed the weekly budget.",
      "Respect every dietary need and nutritional goal. Never invent prices, products, or IDs.",
      "Write concise, safe cooking instructions in English.",
    ].join(" "),
    input: JSON.stringify({ preferences: input, candidateProducts: compactProducts }),
    text: { format: zodTextFormat(MealPlanDraftSchema, "weekly_meal_plan") },
  });

  const draft = response.output_parsed;
  if (!draft) throw new Error("The model returned no structured meal plan.");

  const returnedDays = new Set(draft.meals.map((meal) => meal.day));
  if (returnedDays.size !== weekDays.length || weekDays.some((day) => !returnedDays.has(day))) {
    throw new Error("The model did not return exactly one meal for every day of the week.");
  }

  const productById = new Map(products.map((product) => [product.id, product]));
  const usedProductIds = new Set(draft.meals.flatMap((meal) => meal.productIds));
  const unknownIds = [...usedProductIds].filter((id) => !productById.has(id));
  if (unknownIds.length > 0) throw new Error("The model referenced products outside the approved shortlist.");

  const estimatedCost = [...usedProductIds].reduce((total, id) => total + productById.get(id)!.price, 0);
  if (estimatedCost > input.weeklyBudget) {
    throw new Error("The generated basket exceeded the selected weekly budget. Please retry.");
  }

  const meals = draft.meals.map((meal) => {
    const mealProductIds = new Set(meal.productIds);
    if (meal.ingredients.some((ingredient) => !mealProductIds.has(ingredient.productId))) {
      throw new Error("The model returned an ingredient that was not included in its meal product list.");
    }

    const mealProducts = [...new Set(meal.productIds)].map((id) => productById.get(id)!);
    const mealCost = mealProducts.reduce((total, product) => total + product.price, 0);
    return {
      ...meal,
      ingredients: meal.ingredients.map((ingredient) => ({
        ...ingredient,
        name: productById.get(ingredient.productId)!.name,
      })),
      pricePerServing: Number((mealCost / meal.servings).toFixed(2)),
    };
  });

  return MealPlanSchema.parse({
    currency: "EUR",
    estimatedCost: Number(estimatedCost.toFixed(2)),
    meals,
  });
}
