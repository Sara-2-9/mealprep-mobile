import { useRouter } from "expo-router";

import { PrimaryButton } from "@/components/ui/primary-button";
import { SelectionGrid } from "@/components/ui/selection-grid";
import { StepHeader } from "@/components/ui/step-header";
import { WizardScreen } from "@/components/ui/wizard-screen";
import { dietaryNeeds } from "@/domain/preferences";
import { useMealPlanWizard } from "@/features/wizard/wizard-context";

export function DietaryNeedsScreen() {
  const { push } = useRouter();
  const { dietaryNeeds: selected, setDietaryNeeds } = useMealPlanWizard();

  return (
    <WizardScreen
      footer={<PrimaryButton disabled={selected.length === 0} onPress={() => push("/nutritional-goals")} />}
    >
      <StepHeader progress={0.5} title="Any dietary needs?" />
      <SelectionGrid choices={dietaryNeeds} onChange={setDietaryNeeds} selected={selected} />
    </WizardScreen>
  );
}
