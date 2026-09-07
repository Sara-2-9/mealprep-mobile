import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { colors } from "@/design-system/tokens";

const TRACK_WIDTH = 345;
const TRACK_HEIGHT = 16;
const THUMB_SIZE = 64;
const MIN = 25;
const MAX = 150;
const STEP = 5;
const NUM_STEPS = (MAX - MIN) / STEP;
const STEP_WIDTH = (TRACK_WIDTH - THUMB_SIZE) / NUM_STEPS;

type BudgetSliderProps = {
  onChange: (value: number) => void;
  onInteractionEnd?: () => void;
  onInteractionStart?: () => void;
  value: number;
};

function valueToStep(value: number) {
  return Math.max(
    0,
    Math.min(NUM_STEPS, Math.round((value - MIN) / STEP)),
  );
}

export function BudgetSlider({
  onChange,
  onInteractionEnd,
  onInteractionStart,
  value,
}: BudgetSliderProps) {
  const initialStep = valueToStep(value);
  const position = useSharedValue(initialStep * STEP_WIDTH);
  const start = useSharedValue(initialStep * STEP_WIDTH);
  const lastStep = useSharedValue(initialStep);

  const selectStep = (stepIndex: number) => {
    onChange(MIN + stepIndex * STEP);
    Haptics.selectionAsync().catch(() => undefined);
  };
  const beginInteraction = () => onInteractionStart?.();
  const endInteraction = () => onInteractionEnd?.();

  useEffect(() => {
    const nextStep = valueToStep(value);
    lastStep.set(nextStep);
    position.set(nextStep * STEP_WIDTH);
  }, [lastStep, position, value]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-2, 2])
    .failOffsetY([-12, 12])
    .onBegin(() => {
      start.set(position.get());
      runOnJS(beginInteraction)();
    })
    .onUpdate((event) => {
      const raw = start.get() + event.translationX;
      const clamped = Math.max(
        0,
        Math.min(TRACK_WIDTH - THUMB_SIZE, raw),
      );
      const nextStep = Math.max(
        0,
        Math.min(NUM_STEPS, Math.round(clamped / STEP_WIDTH)),
      );

      position.set(nextStep * STEP_WIDTH);
      if (nextStep !== lastStep.get()) {
        lastStep.set(nextStep);
        runOnJS(selectStep)(nextStep);
      }
    })
    .onFinalize(() => {
      runOnJS(endInteraction)();
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.get() }],
  }));
  const fillStyle = useAnimatedStyle(() => ({
    width: position.get() + THUMB_SIZE / 2,
  }));

  const updateFromAccessibility = (direction: 1 | -1) => {
    const nextStep = Math.max(
      0,
      Math.min(NUM_STEPS, valueToStep(value) + direction),
    );
    selectStep(nextStep);
  };

  return (
    <GestureDetector gesture={panGesture}>
      <View
        accessible
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        accessibilityRole="adjustable"
        accessibilityValue={{
          max: MAX,
          min: MIN,
          now: value,
          text: `€${value} per week`,
        }}
        onAccessibilityAction={(event) =>
          updateFromAccessibility(
            event.nativeEvent.actionName === "increment" ? 1 : -1,
          )
        }
        style={styles.container}
      >
        <View style={styles.track}>
          <Animated.View pointerEvents="none" style={[styles.fill, fillStyle]} />
        </View>
        <Animated.View
          pointerEvents="none"
          style={[styles.thumb, thumbStyle]}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    height: THUMB_SIZE,
    justifyContent: "center",
    width: TRACK_WIDTH,
  },
  track: {
    backgroundColor: colors.surface,
    borderRadius: 99,
    height: TRACK_HEIGHT,
    overflow: "hidden",
    width: TRACK_WIDTH,
  },
  fill: {
    backgroundColor: colors.accent,
    borderRadius: 99,
    height: TRACK_HEIGHT,
  },
  thumb: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 4,
    height: THUMB_SIZE,
    left: 0,
    position: "absolute",
    width: THUMB_SIZE,
  },
});
