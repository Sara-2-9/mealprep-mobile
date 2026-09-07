import Constants from "expo-constants";

import { MealPlanSchema, type MealPlan, type MealPlanRequest } from "@/domain/meal-plan";
import { resolveApiBaseUrl } from "@/services/api-base-url";

const DEFAULT_API_URL = "http://localhost:3000";

export async function requestMealPlan(input: MealPlanRequest, signal?: AbortSignal): Promise<MealPlan> {
  const configuredUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_URL;
  const developmentHost =
    Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  const baseUrl = resolveApiBaseUrl(configuredUrl, developmentHost);
  let response: Response;

  try {
    response = await fetch(`${baseUrl.replace(/\/$/, "")}/meal-plan`, {
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error(
      "The MealPrep API is unavailable. Keep this device on the same Wi-Fi network as your Mac, then restart with bun run ios.",
    );
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Meal plan generation failed.");
  }

  return MealPlanSchema.parse(await response.json());
}
