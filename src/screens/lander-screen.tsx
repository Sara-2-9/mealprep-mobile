import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { LanderIllustration } from "@/components/illustrations/lander-illustration";
import { AppText } from "@/components/ui/app-text";
import { PrimaryButton } from "@/components/ui/primary-button";
import { layout } from "@/design-system/tokens";
import { useColors } from "@/hooks/use-colors";

export function LanderScreen() {
  const colors = useColors();
  const { push } = useRouter();
  const { bottom } = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.screen, { backgroundColor: colors.canvas }]}
    >
      <View style={styles.titleRow}>
        <AppText
          style={[styles.title, { color: colors.ink }]}
          weight="semibold"
        >
          MealPrep
        </AppText>
      </View>
      <View style={styles.illustration}>
        <LanderIllustration />
      </View>
      <View
        style={[styles.footer, { marginBottom: Math.max(bottom + 23, 32) }]}
      >
        <PrimaryButton
          label="Create your meal plan"
          onPress={() => push("/budget")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: "center", flex: 1 },
  titleRow: { alignItems: "center", height: 67, marginTop: 20, width: 345 },
  title: { fontSize: 48, lineHeight: 67 },
  illustration: { marginTop: 103 },
  footer: { marginTop: "auto", width: layout.contentWidth },
});
