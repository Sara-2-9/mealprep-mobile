import type { TextStyle } from "react-native";

export const fontFamilies = {
  regular: "Promo-Regular",
  medium: "Promo-Medium",
  semibold: "Promo-SemiBold",
  bold: "Promo-Bold",
} as const;

export type FontWeight = keyof typeof fontFamilies;

export const typeStyles = {
  stepTitle: {
    fontSize: 32,
    lineHeight: 45,
    letterSpacing: 0,
  },
} satisfies Record<string, TextStyle>;
