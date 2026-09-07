import { useColorScheme } from "react-native";

const budgetShine = [
  "#1A1A1A",
  "#34C759",
  "#1A1A1A",
  "#34C759",
  "#1A1A1A",
] as const;

const lightColors = {
  accent: "#34C759",
  activeDayCell: "#000000",
  activeDayLabel: "#FFFFFF",
  budgetShine,
  canvas: "#FDFFFB",
  card: "#FFFFFF",
  ingredientChip: "#DDF5E3",
  ingredientLabel: "#174D25",
  ink: "#000000",
  mask: "#000000",
  muted: "rgba(60, 60, 67, 0.6)",
  onAccent: "#FFFFFF",
  selected: "#E8F9EC",
  surface: "#F2F2F7",
  transparent: "transparent",
} as const;

const darkColors = {
  accent: "#34C759",
  activeDayCell: "#FFFFFF",
  activeDayLabel: "#000000",
  budgetShine,
  canvas: "#121612",
  card: "#121612",
  ingredientChip: "#1E2B24",
  ingredientLabel: "#FFFFFF",
  ink: "#FFFFFF",
  mask: "#000000",
  muted: "rgba(235, 235, 245, 0.6)",
  onAccent: "#FFFFFF",
  selected: "#1E2B24",
  surface: "#2A2A2A",
  transparent: "transparent",
} as const;

export function useColors() {
  return useColorScheme() === "dark" ? darkColors : lightColors;
}
