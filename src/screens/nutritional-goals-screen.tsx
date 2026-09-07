import { useRouter } from "expo-router";

import { PrimaryButton } from "@/components/ui/primary-button";
import { SelectionGrid } from "@/components/ui/selection-grid";
import { WizardScreen } from "@/components/ui/wizard-screen";
import { nutritionalGoals } from "@/domain/preferences";
import { useMealPlanWizard } from "@/features/wizard/wizard-context";

export function NutritionalGoalsScreen() {
  const { push } = useRouter();
  const { nutritionalGoals: selected, setNutritionalGoals } =
    useMealPlanWizard();

  return (
    <WizardScreen
      footer={
        <PrimaryButton
          disabled={selected.length === 0}
          onPress={() => push("/meal-plan")}
        />
      }
    >
      <SelectionGrid
        choices={nutritionalGoals}
        onChange={setNutritionalGoals}
        selected={selected}
      />
    </WizardScreen>
  );
}
