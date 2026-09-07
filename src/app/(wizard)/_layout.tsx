import { Stack, usePathname } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StepHeader } from "@/components/ui/step-header";
import { useColors } from "@/hooks/use-colors";

const steps = {
  "/budget": { progress: 0.25, title: "What’s your budget?" },
  "/dietary-needs": { progress: 0.5, title: "Any dietary needs?" },
  "/nutritional-goals": { progress: 0.75, title: "Any nutritional goals?" },
} as const;

export default function WizardLayout() {
  const colors = useColors();
  const pathname = usePathname();
  const step = steps[pathname as keyof typeof steps] ?? steps["/budget"];

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.screen, { backgroundColor: colors.canvas }]}
    >
      <View style={styles.header}>
        <StepHeader progress={step.progress} title={step.title} />
      </View>
      <Stack
        screenOptions={{
          animation: Platform.OS === "ios" ? "simple_push" : "ios_from_right",
          animationMatchesGesture: true,
          contentStyle: { backgroundColor: colors.canvas },
          fullScreenGestureEnabled: true,
          fullScreenGestureShadowEnabled: false,
          gestureDirection: "horizontal",
          headerShown: false,
          presentation: "card",
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 20 },
  screen: { flex: 1 },
});
