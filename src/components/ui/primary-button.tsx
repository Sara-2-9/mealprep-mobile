import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "./app-text";

import { colors } from "@/design-system/tokens";


type PrimaryButtonProps = Omit<PressableProps, "children" | "style"> & {
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ disabled, label = "Continue", onPress, style, ...props }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={(event) => {
        void Haptics.selectionAsync();
        onPress?.(event);
      }}
      style={[
        styles.button,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <View pointerEvents="none">
        <AppText style={[styles.label, disabled && styles.disabledLabel]} weight="semibold">
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderCurve: "continuous",
    borderRadius: 999,
    height: 72,
    justifyContent: "center",
    width: "100%",
  },
  disabled: { backgroundColor: colors.surface },
  label: { color: colors.white, fontSize: 20, lineHeight: 28 },
  disabledLabel: { color: colors.muted },
});
