export const dietaryNeeds = [
  { id: "none", label: "None", emoji: "" },
  { id: "vegetarian", label: "Veggie", emoji: "🥕" },
  { id: "vegan", label: "Vegan", emoji: "🌱" },
  { id: "pescatarian", label: "Pescatarian", emoji: "🐟" },
  { id: "gluten-free", label: "Gluten free", emoji: "🌾" },
  { id: "dairy-free", label: "Dairy free", emoji: "🥛" },
] as const;

export const nutritionalGoals = [
  { id: "none", label: "None", emoji: "" },
  { id: "high-protein", label: "High protein", emoji: "🥩" },
  { id: "low-sugar", label: "Low sugar", emoji: "🍯" },
  { id: "low-fat", label: "Low fat", emoji: "🫑" },
  { id: "low-carbs", label: "Low carbs", emoji: "🍝" },
  { id: "low-salt", label: "Low salt", emoji: "🧂" },
] as const;

export type DietaryNeed = (typeof dietaryNeeds)[number]["id"];
export type NutritionalGoal = (typeof nutritionalGoals)[number]["id"];

export function toggleExclusiveNone<T extends string>(
  current: T[],
  value: T,
): T[] {
  if (value === "none") return [value];

  const withoutNone = current.filter((item) => item !== "none");
  return withoutNone.includes(value)
    ? withoutNone.filter((item) => item !== value)
    : [...withoutNone, value];
}
