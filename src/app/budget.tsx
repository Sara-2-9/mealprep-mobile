import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { BudgetSlider } from "@/components/ui/budget-slider";
import { PrimaryButton } from "@/components/ui/primary-button";
import { StepHeader } from "@/components/ui/step-header";
import { WizardScreen } from "@/components/ui/wizard-screen";
import { colors } from "@/design-system/tokens";
import { useMealPlanWizard } from "@/features/wizard/wizard-context";

export default function BudgetScreen() {
  const router = useRouter();
  const { setWeeklyBudget, weeklyBudget } = useMealPlanWizard();

  return (
    <WizardScreen footer={<PrimaryButton onPress={() => router.push("/dietary-needs")} />}>
      <StepHeader progress={0.25} title="What’s your budget?" />
      <View style={styles.amount}>
        <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.value} weight="semibold">€{weeklyBudget}</AppText>
        <AppText style={styles.unit} weight="medium">per week</AppText>
      </View>
      <View style={styles.slider}>
        <BudgetSlider onChange={setWeeklyBudget} step={1} value={weeklyBudget} />
      </View>
    </WizardScreen>
  );
}

const styles = StyleSheet.create({
  amount: { alignItems: "center", height: 149, marginTop: 101 },
  value: { color: "#1A1A1A", fontSize: 96, lineHeight: 118 },
  unit: { color: colors.muted, fontSize: 20, lineHeight: 28, marginTop: -3 },
  slider: { alignItems: "center", marginTop: 58 },
});

