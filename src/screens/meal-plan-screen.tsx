import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/app-text";
import { MealDetails } from "@/components/ui/meal-details";
import { MealPlanLoading } from "@/components/ui/meal-plan-loading";
import { PrimaryButton } from "@/components/ui/primary-button";
import { colors } from "@/design-system/tokens";
import { useMealPlan } from "@/features/meal-plan/use-meal-plan";
import { useMealPlanWizard } from "@/features/wizard/wizard-context";

const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function MealPlanScreen() {
  const { replace } = useRouter();
  const { reset } = useMealPlanWizard();
  const [activeDay, setActiveDay] = useState(0);
  const { data, error, retry, status } = useMealPlan();
  const activeMeal = data?.meals[activeDay];
  const startOver = () => {
    reset();
    replace("/");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable accessibilityLabel="Start over" accessibilityRole="button" hitSlop={10} onPress={startOver}>
          <AppText style={styles.restart}>↻</AppText>
        </Pressable>
        <AppText style={styles.title} weight="semibold">Bon appetit!</AppText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.costCard}>
        <AppText style={styles.costLabel} weight="medium">Est. cost</AppText>
        <View style={styles.costRow}>
          <AppText style={styles.cost} weight="medium">€{data?.estimatedCost.toFixed(0) ?? "—"}</AppText>
          <AppText style={styles.perWeek} weight="medium">/ week</AppText>
        </View>
      </View>

      <View style={styles.days}>
        {shortDays.map((day, index) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: activeDay === index }}
            disabled={status !== "success"}
            key={day}
            onPress={() => setActiveDay(index)}
            style={[styles.day, activeDay === index && styles.activeDay]}
          >
            <AppText style={[styles.dayText, activeDay === index && styles.activeDayText]} weight="medium">{day}</AppText>
          </Pressable>
        ))}
      </View>

      <View style={styles.planCard}>
        {status === "loading" ? <MealPlanLoading /> : null}
        {status === "success" && activeMeal ? <MealDetails key={activeMeal.day} meal={activeMeal} /> : null}
        {status === "error" ? (
          <View style={styles.error}>
            <AppText style={styles.errorTitle} weight="semibold">We couldn’t build your plan.</AppText>
            <AppText accessibilityLiveRegion="polite" style={styles.errorCopy}>{error}</AppText>
            <PrimaryButton label="Try again" onPress={retry} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: "center", backgroundColor: colors.accent, flex: 1 },
  headerRow: { alignItems: "center", flexDirection: "row", height: 56, justifyContent: "space-between", marginTop: 20, paddingHorizontal: 20, width: "100%" },
  restart: { color: colors.ink, fontSize: 26, lineHeight: 32, width: 28 },
  title: { color: colors.ink, fontSize: 40, lineHeight: 56 },
  headerSpacer: { width: 28 },
  costCard: { alignItems: "center", backgroundColor: colors.white, borderCurve: "continuous", borderRadius: 16, height: 72, justifyContent: "center", marginTop: 12, width: 353 },
  costLabel: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  costRow: { alignItems: "baseline", flexDirection: "row", gap: 4 },
  cost: { color: colors.ink, fontSize: 24, lineHeight: 34 },
  perWeek: { color: colors.ink, fontSize: 16, lineHeight: 22 },
  days: { flexDirection: "row", gap: 4, marginTop: 12, width: 353 },
  day: { alignItems: "center", backgroundColor: colors.white, borderCurve: "continuous", borderRadius: 12, height: 40, justifyContent: "center", width: 47 },
  activeDay: { backgroundColor: colors.ink },
  dayText: { color: colors.ink, fontSize: 14, lineHeight: 20 },
  activeDayText: { color: colors.white },
  planCard: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, flex: 1, marginTop: 32, overflow: "hidden", width: 337 },
  error: { flex: 1, gap: 14, justifyContent: "center", padding: 24 },
  errorTitle: { color: colors.ink, fontSize: 24, lineHeight: 33, textAlign: "center" },
  errorCopy: { color: colors.muted, fontSize: 15, lineHeight: 21, marginBottom: 12, textAlign: "center" },
});
