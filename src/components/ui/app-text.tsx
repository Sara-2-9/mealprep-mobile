import { StyleSheet, Text, type TextProps } from "react-native";

import { fontFamilies, type FontWeight } from "@/design-system/typography";

type AppTextProps = TextProps & { weight?: FontWeight };

export function AppText({ style, weight = "regular", ...props }: AppTextProps) {
  return <Text {...props} style={[styles.base, { fontFamily: fontFamilies[weight] }, style]} />;
}

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
