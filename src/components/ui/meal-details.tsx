import { type ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { AppText } from "./app-text";

import { CashIcon, ClockIcon, PersonIcon } from "@/components/icons/app-icons";
import type { MealPlan } from "@/domain/meal-plan";
import { colors } from "@/design-system/tokens";

type MealDetailsProps = { meal: MealPlan["meals"][number] };

function MetaItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View style={styles.metaItem}>
      <View style={styles.metaIcon}>{icon}</View>
      <AppText style={styles.metaText}>{label}</AppText>
    </View>
  );
}

export function MealDetails({ meal }: MealDetailsProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <AppText style={styles.day} weight="semibold">
        {meal.day}
      </AppText>
      <View style={styles.summary}>
        <AppText numberOfLines={2} style={styles.mealName} weight="semibold">
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

      <AppText style={styles.sectionTitle} weight="semibold">
        Ingredients
      </AppText>
      <View style={styles.ingredients}>
        {meal.ingredients.map((ingredient) => (
          <View
            key={`${ingredient.productId}-${ingredient.quantity}`}
            style={styles.ingredient}
          >
            <AppText numberOfLines={1} style={styles.ingredientText}>
              {ingredient.quantity} · {ingredient.name}
            </AppText>
          </View>
        ))}
      </View>

      <AppText style={styles.recipeTitle} weight="semibold">
        Recipe
      </AppText>
      <View style={styles.steps}>
        {meal.steps.map((step, index) => (
          <View key={`${index}-${step}`} style={styles.step}>
            <View style={styles.stepNumber}>
              <AppText style={styles.stepNumberText} weight="semibold">
                {index + 1}
              </AppText>
            </View>
            <AppText style={styles.stepText}>{step}</AppText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 48 },
  day: { color: colors.ink, fontSize: 24, lineHeight: 33 },
  summary: { gap: 8, marginTop: 28 },
  mealName: { color: colors.ink, fontSize: 16, lineHeight: 22 },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaItem: { alignItems: "center", flexDirection: "row", gap: 4 },
  metaIcon: { height: 16, width: 16 },
  metaText: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  sectionTitle: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 28,
  },
  ingredients: { gap: 8, marginTop: 12 },
  ingredient: {
    backgroundColor: "#DDF5E3",
    borderCurve: "continuous",
    borderRadius: 999,
    minHeight: 22,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  ingredientText: { color: "#174D25", fontSize: 12, lineHeight: 16 },
  recipeTitle: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 28,
  },
  steps: { gap: 14, marginTop: 12 },
  step: { alignItems: "flex-start", flexDirection: "row", gap: 10 },
  stepNumber: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderCurve: "continuous",
    borderRadius: 999,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  stepNumberText: { color: colors.ink, fontSize: 12, lineHeight: 16 },
  stepText: { color: colors.ink, flex: 1, fontSize: 14, lineHeight: 20 },
});
