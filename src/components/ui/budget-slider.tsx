import { useEffect, useState } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";

import { colors } from "@/design-system/tokens";

const TRACK_WIDTH = 345;
const THUMB_SIZE = 64;

function valueToPosition(value: number, minimum: number, maximum: number) {
  const usableWidth = TRACK_WIDTH - THUMB_SIZE;
  return ((value - minimum) / (maximum - minimum)) * usableWidth;
}

type BudgetSliderProps = {
  accessibilityStep?: number;
  maximum?: number;
  minimum?: number;
  onChange: (value: number) => void;
  onInteractionEnd?: () => void;
  onInteractionStart?: () => void;
  value: number;
};

export function BudgetSlider({
  accessibilityStep = 5,
  maximum = 150,
  minimum = 25,
  onChange,
  onInteractionEnd,
  onInteractionStart,
  value,
}: BudgetSliderProps) {
  const usableWidth = TRACK_WIDTH - THUMB_SIZE;
  const [thumbX] = useState(
    () => new Animated.Value(valueToPosition(value, minimum, maximum)),
  );
  const [controller] = useState(() => {
    let dragging = false;
    let gestureStartX = valueToPosition(value, minimum, maximum);
    const clampX = (x: number) => Math.max(0, Math.min(usableWidth, x));
    const updateX = (x: number) => {
      const nextX = clampX(x);
      thumbX.setValue(nextX);
      const nextValue =
        minimum + (nextX / usableWidth) * (maximum - minimum);
      onChange(nextValue);
    };
    const endInteraction = () => {
      dragging = false;
      onInteractionEnd?.();
    };
    const responder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (event) => {
        dragging = true;
        thumbX.stopAnimation();
        gestureStartX = clampX(
          event.nativeEvent.locationX - THUMB_SIZE / 2,
        );
        updateX(gestureStartX);
      },
      onPanResponderMove: (_event, gestureState) =>
        updateX(gestureStartX + gestureState.dx),
      onPanResponderRelease: endInteraction,
      onPanResponderTerminate: endInteraction,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
    });

    return {
      isDragging: () => dragging,
      panHandlers: responder.panHandlers,
    };
  });

  useEffect(() => {
    if (controller.isDragging()) return;
    const animation = Animated.timing(thumbX, {
      duration: 120,
      toValue: valueToPosition(value, minimum, maximum),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [controller, maximum, minimum, thumbX, value]);

  const fillScaleX = thumbX.interpolate({
    inputRange: [0, usableWidth],
    outputRange: [
      THUMB_SIZE / 2 / TRACK_WIDTH,
      (usableWidth + THUMB_SIZE / 2) / TRACK_WIDTH,
    ],
  });

  return (
    <View
      accessible
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      accessibilityRole="adjustable"
      accessibilityValue={{
        max: maximum,
        min: minimum,
        now: value,
        text: `€${value} per week`,
      }}
      onAccessibilityAction={(event) =>
        onChange(
          event.nativeEvent.actionName === "increment"
            ? Math.min(maximum, value + accessibilityStep)
            : Math.max(minimum, value - accessibilityStep),
        )
      }
      onTouchStart={onInteractionStart}
      style={styles.wrapper}
      {...controller.panHandlers}
    >
      <View style={styles.track}>
        <Animated.View
          pointerEvents="none"
          style={[styles.fill, { transform: [{ scaleX: fillScaleX }] }]}
        />
      </View>
      <Animated.View
        pointerEvents="none"
        style={[styles.thumb, { transform: [{ translateX: thumbX }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { height: THUMB_SIZE, justifyContent: "center", width: TRACK_WIDTH },
  track: {
    backgroundColor: colors.surface,
    borderCurve: "continuous",
    borderRadius: 999,
    height: 16,
    overflow: "hidden",
    width: TRACK_WIDTH,
  },
  fill: {
    backgroundColor: colors.accent,
    borderCurve: "continuous",
    borderRadius: 999,
    height: 16,
    transformOrigin: "left center",
    width: TRACK_WIDTH,
  },
  thumb: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderCurve: "continuous",
    borderRadius: 999,
    borderWidth: 4,
    height: THUMB_SIZE,
    left: 0,
    position: "absolute",
    width: THUMB_SIZE,
  },
});
