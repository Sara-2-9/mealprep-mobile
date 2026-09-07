import { useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { BudgetSlider } from "@/components/ui/budget-slider";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SlidingBudgetValue } from "@/components/ui/sliding-budget-value";
import { WizardScreen } from "@/components/ui/wizard-screen";
import { colors } from "@/design-system/tokens";
import { useMealPlanWizard } from "@/features/wizard/wizard-context";

export function BudgetScreen() {
  const { push } = useRouter();
  const rootNavigation = useNavigation("/");
  const { setWeeklyBudget, weeklyBudget } = useMealPlanWizard();
  const setBackGestureEnabled = (gestureEnabled: boolean) =>
    rootNavigation.setOptions({ gestureEnabled });
  const updateBudget = (value: number) =>
    setWeeklyBudget(Math.round(value / 5) * 5);

  useEffect(
    () => () => rootNavigation.setOptions({ gestureEnabled: true }),
    [rootNavigation],
  );

  return (
    <WizardScreen
      footer={<PrimaryButton onPress={() => push("/dietary-needs")} />}
    >
      <View style={styles.amount}>
        <SlidingBudgetValue value={weeklyBudget} />
        <AppText style={styles.unit} weight="medium">
          per week
        </AppText>
      </View>
      <View style={styles.slider}>
        <BudgetSlider
          onChange={updateBudget}
          onInteractionEnd={() => setBackGestureEnabled(true)}
          onInteractionStart={() => setBackGestureEnabled(false)}
          value={weeklyBudget}
        />
      </View>
    </WizardScreen>
  );
}

const styles = StyleSheet.create({
  amount: { alignItems: "center", height: 149, marginTop: 101 },
  unit: { color: colors.muted, fontSize: 20, lineHeight: 28, marginTop: -3 },
  slider: { alignItems: "center", marginTop: 58 },
});
