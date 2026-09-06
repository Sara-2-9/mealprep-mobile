import { useRouter } from "expo-router";

import { PrimaryButton } from "@/components/ui/primary-button";
import { SelectionGrid } from "@/components/ui/selection-grid";
import { StepHeader } from "@/components/ui/step-header";
import { WizardScreen } from "@/components/ui/wizard-screen";
import { nutritionalGoals } from "@/domain/preferences";
import { useMealPlanWizard } from "@/features/wizard/wizard-context";

export default function NutritionalGoalsScreen() {
  const router = useRouter();
  const { nutritionalGoals: selected, setNutritionalGoals } = useMealPlanWizard();

  return (
    <WizardScreen footer={<PrimaryButton disabled={selected.length === 0} onPress={() => router.push("/meal-plan")} />}>
      <StepHeader progress={0.75} title="Any nutritional goals?" />
      <SelectionGrid choices={nutritionalGoals} onChange={setNutritionalGoals} selected={selected} />
    </WizardScreen>
  );
}
