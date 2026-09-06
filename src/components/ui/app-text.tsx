import { Text, type TextProps } from "react-native";

type AppTextProps = TextProps & {
  weight?: "regular" | "medium" | "semibold" | "bold";
};

const fontFamily = {
  regular: "Promo-Regular",
  medium: "Promo-Medium",
  semibold: "Promo-SemiBold",
  bold: "Promo-Bold",
} as const;

export function AppText({ style, weight = "regular", ...props }: AppTextProps) {
  return <Text {...props} style={[{ fontFamily: fontFamily[weight] }, style]} />;
}

