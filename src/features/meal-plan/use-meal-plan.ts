import { useCallback, useEffect, useRef, useState } from "react";

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
  const requestId = useRef(0);

  const generate = useCallback(async (signal?: AbortSignal) => {
    const currentRequest = ++requestId.current;

    try {
      const data = await requestMealPlan({ dietaryNeeds, nutritionalGoals, weeklyBudget }, signal);
      if (requestId.current === currentRequest) setState({ status: "success", data, error: null });
    } catch (error) {
      if (signal?.aborted || requestId.current !== currentRequest) return;
      setState({ status: "error", data: null, error: error instanceof Error ? error.message : "Unexpected error." });
    }
  }, [dietaryNeeds, nutritionalGoals, weeklyBudget]);

  useEffect(() => {
    const controller = new AbortController();
    // Route entry is the external trigger for this abortable network request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void generate(controller.signal);
    return () => controller.abort();
  }, [generate]);

  const retry = useCallback(() => {
    setState({ status: "loading", data: null, error: null });
    void generate();
  }, [generate]);

  return { ...state, retry };
}
