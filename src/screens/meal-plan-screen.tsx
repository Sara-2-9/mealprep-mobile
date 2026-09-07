import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/app-text";
import { MealDetails } from "@/components/ui/meal-details";
import { MealPlanLoading } from "@/components/ui/meal-plan-loading";
import { PrimaryButton } from "@/components/ui/primary-button";
import { colors } from "@/design-system/tokens";
import { useMealPlan } from "@/features/meal-plan/use-meal-plan";
import { useMealPlanWizard } from "@/features/wizard/wizard-context";
import type { MealPlan } from "@/domain/meal-plan";

const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const DAY_PITCH = 51;
const CARD_GAP = 12;

function CostSkeleton() {
  const [opacity] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { duration: 650, toValue: 0.35, useNativeDriver: true }),
        Animated.timing(opacity, { duration: 650, toValue: 1, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityLabel="Estimated cost loading"
      style={[styles.costSkeleton, { opacity }]}
    />
  );
}

type MealPageProps = {
  cardWidth: number;
  index: number;
  meal: MealPlan["meals"][number];
  pageStep: number;
  scrollX: Animated.Value;
};

function MealPage({ cardWidth, index, meal, pageStep, scrollX }: MealPageProps) {
  const inputRange = [(index - 1) * pageStep, index * pageStep, (index + 1) * pageStep];
  const opacity = scrollX.interpolate({ extrapolate: "clamp", inputRange, outputRange: [0.72, 1, 0.72] });

  return (
    <View style={[styles.page, { width: pageStep }]}>
      <Animated.View
        style={[styles.planCard, { opacity, width: cardWidth }]}
      >
        <MealDetails meal={meal} />
      </Animated.View>
    </View>
  );
}

export function MealPlanScreen() {
  const { replace } = useRouter();
  const { reset } = useMealPlanWizard();
  const { width: viewportWidth } = useWindowDimensions();
  const cardWidth = Math.min(337, viewportWidth - 40);
  const pageStep = cardWidth + CARD_GAP;
  const sideInset = (viewportWidth - cardWidth) / 2;
  const [activeDay, setActiveDay] = useState(0);
  const { data, error, retry, status } = useMealPlan();
  const pagerRef = useRef<ScrollView>(null);
  const [scrollX] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => subscription.remove();
  }, []);

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
    listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextDay = Math.max(0, Math.min(shortDays.length - 1, Math.round(event.nativeEvent.contentOffset.x / pageStep)));
      setActiveDay((currentDay) => (currentDay === nextDay ? currentDay : nextDay));
    },
    useNativeDriver: true,
  });
  const indicatorTranslateX = scrollX.interpolate({
    extrapolate: "clamp",
    inputRange: [0, pageStep * (shortDays.length - 1)],
    outputRange: [0, DAY_PITCH * (shortDays.length - 1)],
  });
  const startOver = () => {
    reset();
    replace("/");
  };
  const selectDay = (index: number) => {
    setActiveDay(index);
    pagerRef.current?.scrollTo({ animated: true, x: index * pageStep, y: 0 });
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable
          accessibilityLabel="Start over"
          accessibilityRole="button"
          hitSlop={10}
          onPress={startOver}
        >
          <AppText style={styles.restart}>↻</AppText>
        </Pressable>
        <AppText style={styles.title} weight="semibold">
          Bon appetit!
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.costCard}>
        <AppText style={styles.costLabel} weight="medium">
          Est. cost
        </AppText>
        <View style={styles.costRow}>
          {status === "loading" ? <CostSkeleton /> : null}
          {status === "success" ? (
            <AppText style={styles.cost} weight="medium">
              €{data.estimatedCost.toFixed(0)}
            </AppText>
          ) : null}
          {status === "error" ? (
            <AppText style={styles.cost} weight="medium">
              —
            </AppText>
          ) : null}
          <AppText style={styles.perWeek} weight="medium">
            / week
          </AppText>
        </View>
      </View>

      <View style={styles.days}>
        <View pointerEvents="none" style={styles.dayBackgrounds}>
          {shortDays.map((day) => (
            <View key={day} style={styles.dayBackground} />
          ))}
        </View>
        <Animated.View
          pointerEvents="none"
          style={[styles.dayIndicator, { transform: [{ translateX: indicatorTranslateX }] }]}
        />
        {shortDays.map((day, index) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: activeDay === index }}
            disabled={status !== "success"}
            key={day}
            onPress={() => selectDay(index)}
            style={styles.day}
          >
            <AppText
              style={[
                styles.dayText,
                activeDay === index && styles.activeDayText,
              ]}
              weight="medium"
            >
              {day}
            </AppText>
          </Pressable>
        ))}
      </View>

      {status === "loading" ? (
        <View style={styles.loadingCard}>
          <MealPlanLoading />
        </View>
      ) : null}
      {status === "success" ? (
        <Animated.ScrollView
          bounces={false}
          decelerationRate="fast"
          directionalLockEnabled
          disableIntervalMomentum
          horizontal
          onScroll={onScroll}
          ref={pagerRef}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={pageStep}
          style={styles.pager}
          contentContainerStyle={{
            paddingLeft: sideInset,
            paddingRight: Math.max(0, sideInset - CARD_GAP),
          }}
        >
          {data.meals.map((meal, index) => (
            <MealPage
              cardWidth={cardWidth}
              index={index}
              key={meal.day}
              meal={meal}
              pageStep={pageStep}
              scrollX={scrollX}
            />
          ))}
        </Animated.ScrollView>
      ) : null}
      {status === "error" ? (
        <View style={styles.loadingCard}>
          <View style={styles.error}>
            <AppText style={styles.errorTitle} weight="semibold">
              We couldn’t build your plan.
            </AppText>
            <AppText accessibilityLiveRegion="polite" style={styles.errorCopy}>
              {error}
            </AppText>
            <PrimaryButton label="Try again" onPress={retry} />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: "center", backgroundColor: colors.accent, flex: 1 },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    height: 56,
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
    width: "100%",
  },
  restart: { color: colors.ink, fontSize: 26, lineHeight: 32, width: 28 },
  title: { color: colors.ink, fontSize: 40, lineHeight: 56 },
  headerSpacer: { width: 28 },
  costCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderCurve: "continuous",
    borderRadius: 16,
    height: 72,
    justifyContent: "center",
    marginTop: 12,
    width: 353,
  },
  costLabel: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  costRow: { alignItems: "baseline", flexDirection: "row", gap: 4 },
  cost: { color: colors.ink, fontSize: 24, lineHeight: 34 },
  costSkeleton: {
    backgroundColor: colors.surface,
    borderCurve: "continuous",
    borderRadius: 999,
    height: 24,
    width: 54,
  },
  perWeek: { color: colors.ink, fontSize: 16, lineHeight: 22 },
  days: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
    position: "relative",
    width: 353,
  },
  day: {
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 47,
    zIndex: 2,
  },
  dayBackgrounds: {
    flexDirection: "row",
    gap: 4,
    left: 0,
    position: "absolute",
    top: 0,
  },
  dayBackground: {
    backgroundColor: colors.white,
    borderCurve: "continuous",
    borderRadius: 12,
    height: 40,
    width: 47,
  },
  dayIndicator: {
    backgroundColor: colors.ink,
    borderCurve: "continuous",
    borderRadius: 12,
    height: 40,
    left: 0,
    position: "absolute",
    top: 0,
    width: 47,
    zIndex: 1,
  },
  dayText: { color: colors.ink, fontSize: 14, lineHeight: 20 },
  activeDayText: { color: colors.white },
  loadingCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
    marginTop: 32,
    overflow: "hidden",
    width: 337,
  },
  pager: { flex: 1, marginTop: 32, width: "100%" },
  page: { alignItems: "flex-start", flex: 1 },
  planCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
    overflow: "hidden",
  },
  error: { flex: 1, gap: 14, justifyContent: "center", padding: 24 },
  errorTitle: {
    color: colors.ink,
    fontSize: 24,
    lineHeight: 33,
    textAlign: "center",
  },
  errorCopy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 12,
    textAlign: "center",
  },
});
