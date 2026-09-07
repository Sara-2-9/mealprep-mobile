import { type PropsWithChildren, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, layout } from "@/design-system/tokens";

type WizardScreenProps = PropsWithChildren<{
  footer: ReactNode;
}>;

export function WizardScreen({ children, footer }: WizardScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View className="flex-1 px-5">{children}</View>
      <View
        style={[
          styles.footer,
          { marginBottom: Math.max(insets.bottom + 23, 32) },
        ]}
      >
        {footer}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 },
  footer: { alignSelf: "center", width: layout.contentWidth },
});
