import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "./app-text";

import { colors } from "@/design-system/tokens";


type StepHeaderProps = { title: string; progress: 0.25 | 0.5 | 0.75 };

export function StepHeader({ progress, title }: StepHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <Pressable accessibilityLabel="Go back" accessibilityRole="button" hitSlop={10} onPress={router.back} style={styles.back}>
          <AppText style={styles.chevron} weight="medium">‹</AppText>
        </Pressable>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]}>
            <View style={styles.highlight} />
          </View>
        </View>
      </View>
      <AppText style={styles.title} weight="semibold">{title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20, width: "100%" },
  progressRow: { alignItems: "center", flexDirection: "row", gap: 10, height: 28 },
  back: { alignItems: "center", height: 28, justifyContent: "center", width: 28 },
  chevron: { color: colors.ink, fontSize: 36, lineHeight: 30, marginTop: -4 },
  track: { backgroundColor: colors.surface, borderCurve: "continuous", borderRadius: 999, height: 20, overflow: "hidden", width: 315 },
  fill: { backgroundColor: colors.accent, borderCurve: "continuous", borderRadius: 999, height: 20, justifyContent: "center" },
  highlight: { backgroundColor: colors.white, borderCurve: "continuous", borderRadius: 999, height: 6, marginHorizontal: 12, opacity: 0.95 },
  title: { color: colors.ink, fontSize: 32, lineHeight: 45 },
});

