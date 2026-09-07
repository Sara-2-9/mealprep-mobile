import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "./app-text";

import { ChevronLeftIcon } from "@/components/icons/app-icons";
import { typeStyles } from "@/design-system/typography";
import { useColors } from "@/hooks/use-colors";

type StepHeaderProps = { title: string; progress: 0.25 | 0.5 | 0.75 };

export function StepHeader({ progress, title }: StepHeaderProps) {
  const colors = useColors();
  const { back } = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={10}
          onPress={back}
          style={[styles.back, { backgroundColor: colors.surface }]}
        >
          <ChevronLeftIcon />
        </Pressable>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{ max: 100, min: 0, now: progress * 100 }}
          style={[styles.track, { backgroundColor: colors.surface }]}
        >
          <View
            style={[
              styles.fill,
              { backgroundColor: colors.accent, width: `${progress * 100}%` },
            ]}
          >
            <View
              style={[styles.highlight, { backgroundColor: colors.onAccent }]}
            />
          </View>
        </View>
      </View>
      <AppText style={[styles.title, { color: colors.ink }]} weight="semibold">
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20, width: "100%" },
  progressRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    height: 28,
  },
  back: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: 99,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  track: {
    borderCurve: "continuous",
    borderRadius: 999,
    height: 20,
    overflow: "hidden",
    width: 315,
  },
  fill: {
    borderCurve: "continuous",
    borderRadius: 999,
    height: 20,
  },
  highlight: {
    borderCurve: "continuous",
    borderRadius: 999,
    height: 6,
    left: 12,
    opacity: 0.5,
    position: "absolute",
    right: 12,
    top: 3,
  },
  title: { ...typeStyles.stepTitle },
});
