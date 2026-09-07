import { Stack } from "expo-router";

import { MealPlanScreen } from "@/screens/meal-plan-screen";

export default function MealPlanRoute() {
  return (
    <>
      <Stack.Screen
        options={{ fullScreenGestureEnabled: false, gestureEnabled: false }}
      />
      <MealPlanScreen />
    </>
  );
}
