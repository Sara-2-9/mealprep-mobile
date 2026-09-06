import { MealPlanSchema, type MealPlan, type MealPlanRequest } from "@/domain/meal-plan";

const DEFAULT_API_URL = "http://localhost:3000";

export async function requestMealPlan(input: MealPlanRequest, signal?: AbortSignal): Promise<MealPlan> {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_URL;
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/meal-plan`, {
    body: JSON.stringify(input),
    headers: { "Content-Type": "application/json" },
    method: "POST",
    signal,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Meal plan generation failed.");
  }

  return MealPlanSchema.parse(await response.json());
}

