import { useEffect, useReducer, useState } from "react";

import { useMealPlanWizard } from "../wizard/wizard-context";

import type { MealPlan } from "@/domain/meal-plan";
import { requestMealPlan } from "@/services/meal-plan-api";


type MealPlanState =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: MealPlan; error: null }
  | { status: "error"; data: null; error: string };

export function useMealPlan() {
  const { dietaryNeeds, nutritionalGoals, weeklyBudget } = useMealPlanWizard();
  const [state, setState] = useState<MealPlanState>({ status: "loading", data: null, error: null });
  const [attempt, startNextAttempt] = useReducer((current: number) => current + 1, 0);

  useEffect(() => {
    const controller = new AbortController();
    void requestMealPlan({ dietaryNeeds, nutritionalGoals, weeklyBudget }, controller.signal)
      .then((data) => setState({ status: "success", data, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: "error", data: null, error: error instanceof Error ? error.message : "Unexpected error." });
      });
    return () => controller.abort();
  }, [attempt, dietaryNeeds, nutritionalGoals, weeklyBudget]);

  const retry = () => {
    setState({ status: "loading", data: null, error: null });
    startNextAttempt();
  };

  return { ...state, retry };
}
