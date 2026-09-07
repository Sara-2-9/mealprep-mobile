import * as Haptics from "expo-haptics";
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { AppText } from "./app-text";

import { useColors } from "@/hooks/use-colors";

type PrimaryButtonProps = Omit<PressableProps, "children" | "style"> & {
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  disabled,
  label = "Continue",
  onPress,
  style,
  ...props
}: PrimaryButtonProps) {
  const colors = useColors();
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
        { backgroundColor: disabled ? colors.surface : colors.accent },
        style,
      ]}
      {...props}
    >
      <View pointerEvents="none">
        <AppText
          style={[
            styles.label,
            { color: disabled ? colors.muted : colors.onAccent },
          ]}
          weight="semibold"
        >
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: 999,
    height: 72,
    justifyContent: "center",
    width: "100%",
  },
  label: { fontSize: 20, lineHeight: 28 },
});
