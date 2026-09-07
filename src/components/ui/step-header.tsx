import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "./app-text";

import { ChevronLeftIcon } from "@/components/icons/app-icons";
import { colors } from "@/design-system/tokens";
import { typeStyles } from "@/design-system/typography";

type StepHeaderProps = { title: string; progress: 0.25 | 0.5 | 0.75 };

export function StepHeader({ progress, title }: StepHeaderProps) {
  const { back } = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={10}
          onPress={back}
          style={styles.back}
        >
          <ChevronLeftIcon />
        </Pressable>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{ max: 100, min: 0, now: progress * 100 }}
          style={styles.track}
        >
          <View style={[styles.fill, { width: `${progress * 100}%` }]}>
            <View style={styles.highlight} />
          </View>
        </View>
      </View>
      <AppText style={styles.title} weight="semibold">
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
    backgroundColor: colors.surface,
    borderCurve: "continuous",
    borderRadius: 99,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  track: {
    backgroundColor: colors.surface,
    borderCurve: "continuous",
    borderRadius: 999,
    height: 20,
    overflow: "hidden",
    width: 315,
  },
  fill: {
    backgroundColor: colors.accent,
    borderCurve: "continuous",
    borderRadius: 999,
    height: 20,
  },
  highlight: {
    backgroundColor: colors.white,
    borderCurve: "continuous",
    borderRadius: 999,
    height: 6,
    left: 12,
    opacity: 0.5,
    position: "absolute",
    right: 12,
    top: 3,
  },
  title: { ...typeStyles.stepTitle, color: colors.ink },
});
