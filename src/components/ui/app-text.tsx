import { StyleSheet, Text, type TextProps } from "react-native";

import { fontFamilies, type FontWeight } from "@/design-system/typography";
import { useColors } from "@/hooks/use-colors";

type AppTextProps = TextProps & { weight?: FontWeight };

export function AppText({ style, weight = "regular", ...props }: AppTextProps) {
  const colors = useColors();
  return (
    <Text
      {...props}
      style={[
        styles.base,
        { color: colors.ink, fontFamily: fontFamilies[weight] },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
