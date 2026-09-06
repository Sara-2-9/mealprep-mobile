import { createContext, useContext, useReducer, type PropsWithChildren } from "react";

import type { DietaryNeed, NutritionalGoal } from "@/domain/preferences";

type WizardState = {
  weeklyBudget: number;
  dietaryNeeds: DietaryNeed[];
  nutritionalGoals: NutritionalGoal[];
};

type WizardAction =
  | { type: "budgetChanged"; value: number }
  | { type: "dietaryNeedsChanged"; value: DietaryNeed[] }
  | { type: "nutritionalGoalsChanged"; value: NutritionalGoal[] }
  | { type: "reset" };

const initialState: WizardState = {
  weeklyBudget: 82,
  dietaryNeeds: [],
  nutritionalGoals: [],
};

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "budgetChanged":
      return { ...state, weeklyBudget: action.value };
    case "dietaryNeedsChanged":
      return { ...state, dietaryNeeds: action.value };
    case "nutritionalGoalsChanged":
      return { ...state, nutritionalGoals: action.value };
    case "reset":
      return initialState;
  }
}

type WizardContextValue = WizardState & {
  setWeeklyBudget: (value: number) => void;
  setDietaryNeeds: (value: DietaryNeed[]) => void;
  setNutritionalGoals: (value: NutritionalGoal[]) => void;
  reset: () => void;
};

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setWeeklyBudget = (value: number) => dispatch({ type: "budgetChanged", value });
  const setDietaryNeeds = (value: DietaryNeed[]) => dispatch({ type: "dietaryNeedsChanged", value });
  const setNutritionalGoals = (value: NutritionalGoal[]) => dispatch({ type: "nutritionalGoalsChanged", value });
  const reset = () => dispatch({ type: "reset" });
  const value = { ...state, setWeeklyBudget, setDietaryNeeds, setNutritionalGoals, reset };

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useMealPlanWizard() {
  const context = useContext(WizardContext);
  if (!context) throw new Error("useMealPlanWizard must be used inside WizardProvider");
  return context;
}
