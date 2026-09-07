import { type ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { AppText } from "./app-text";

import { CashIcon, ClockIcon, PersonIcon } from "@/components/icons/app-icons";
import type { MealPlan } from "@/domain/meal-plan";
import { useColors } from "@/hooks/use-colors";

type MealDetailsProps = { meal: MealPlan["meals"][number] };

function MetaItem({ icon, label }: { icon: ReactNode; label: string }) {
  const colors = useColors();
  return (
    <View style={styles.metaItem}>
      <View style={styles.metaIcon}>{icon}</View>
      <AppText style={[styles.metaText, { color: colors.muted }]}>
        {label}
      </AppText>
    </View>
  );
}

export function MealDetails({ meal }: MealDetailsProps) {
  const colors = useColors();
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <AppText style={[styles.day, { color: colors.ink }]} weight="semibold">
        {meal.day}
      </AppText>
      <View style={styles.summary}>
        <AppText
          numberOfLines={2}
          style={[styles.mealName, { color: colors.ink }]}
          weight="semibold"
        >
          {meal.name}
        </AppText>
        <View style={styles.meta}>
          <MetaItem icon={<ClockIcon />} label={`${meal.prepMinutes} min`} />
          <MetaItem icon={<PersonIcon />} label={`${meal.servings} servings`} />
          <MetaItem
            icon={<CashIcon />}
            label={`€${meal.pricePerServing.toFixed(2)} / serving`}
          />
        </View>
      </View>

      <AppText
        style={[styles.sectionTitle, { color: colors.ink }]}
        weight="semibold"
      >
        Ingredients
      </AppText>
      <View style={styles.ingredients}>
        {meal.ingredients.map((ingredient) => (
          <View
            key={`${ingredient.productId}-${ingredient.quantity}`}
            style={[
              styles.ingredient,
              { backgroundColor: colors.ingredientChip },
            ]}
          >
            <AppText
              numberOfLines={1}
              style={[styles.ingredientText, { color: colors.ingredientLabel }]}
            >
              {ingredient.quantity} · {ingredient.name}
            </AppText>
          </View>
        ))}
      </View>

      <AppText
        style={[styles.recipeTitle, { color: colors.ink }]}
        weight="semibold"
      >
        Recipe
      </AppText>
      <View style={styles.steps}>
        {meal.steps.map((step, index) => (
          <View key={`${index}-${step}`} style={styles.step}>
            <View
              style={[styles.stepNumber, { backgroundColor: colors.surface }]}
            >
              <AppText
                style={[styles.stepNumberText, { color: colors.ink }]}
                weight="semibold"
              >
                {index + 1}
              </AppText>
            </View>
            <AppText style={[styles.stepText, { color: colors.ink }]}>
              {step}
            </AppText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 48 },
  day: { fontSize: 24, lineHeight: 33 },
  summary: { gap: 8, marginTop: 28 },
  mealName: { fontSize: 16, lineHeight: 22 },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaItem: { alignItems: "center", flexDirection: "row", gap: 4 },
  metaIcon: { height: 16, width: 16 },
  metaText: { fontSize: 12, lineHeight: 17 },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 19,
    marginTop: 28,
  },
  ingredients: { gap: 8, marginTop: 12 },
  ingredient: {
    borderCurve: "continuous",
    borderRadius: 999,
    minHeight: 22,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  ingredientText: { fontSize: 12, lineHeight: 16 },
  recipeTitle: {
    fontSize: 14,
    lineHeight: 19,
    marginTop: 28,
  },
  steps: { gap: 14, marginTop: 12 },
  step: { alignItems: "flex-start", flexDirection: "row", gap: 10 },
  stepNumber: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: 999,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  stepNumberText: { fontSize: 12, lineHeight: 16 },
  stepText: { flex: 1, fontSize: 14, lineHeight: 20 },
});
