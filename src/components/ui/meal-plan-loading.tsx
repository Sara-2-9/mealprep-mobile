import { StyleSheet, View } from "react-native";

import { AppText } from "./app-text";

import { useColors } from "@/hooks/use-colors";

export function MealPlanLoading() {
  const colors = useColors();
  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      <AppText style={[styles.title, { color: colors.ink }]} weight="semibold">
        Planning your week…
      </AppText>
      <AppText style={[styles.copy, { color: colors.muted }]}>
        Balancing your budget, preferences, and seven recipes.
      </AppText>
      <View style={styles.lines}>
        {[0, 1, 2, 3].map((line) => (
          <View
            key={line}
            style={[
              styles.line,
              { backgroundColor: colors.surface },
              line === 3 && styles.short,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  title: { fontSize: 24, lineHeight: 33, textAlign: "center" },
  copy: { fontSize: 16, lineHeight: 22, marginTop: 8, textAlign: "center" },
  lines: { gap: 12, marginTop: 32, width: "100%" },
  line: {
    borderCurve: "continuous",
    borderRadius: 999,
    height: 16,
    width: "100%",
  },
  short: { width: "68%" },
});
