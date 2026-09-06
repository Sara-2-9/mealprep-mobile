import { PanResponder, StyleSheet, View } from "react-native";

import { colors } from "@/design-system/tokens";

const TRACK_WIDTH = 345;
const THUMB_SIZE = 64;

type BudgetSliderProps = {
  maximum?: number;
  minimum?: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
};

export function BudgetSlider({ maximum = 150, minimum = 25, onChange, step = 1, value }: BudgetSliderProps) {
  const usableWidth = TRACK_WIDTH - THUMB_SIZE;
  const valueToX = (nextValue: number) => ((nextValue - minimum) / (maximum - minimum)) * usableWidth;
  const xToValue = (x: number) => {
    const raw = minimum + (Math.max(0, Math.min(usableWidth, x)) / usableWidth) * (maximum - minimum);
    return Math.max(minimum, Math.min(maximum, Math.round(raw / step) * step));
  };
  const updateFromTouch = (locationX: number) => onChange(xToValue(locationX - THUMB_SIZE / 2));

  const responder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => updateFromTouch(event.nativeEvent.locationX),
    onPanResponderMove: (event) => updateFromTouch(event.nativeEvent.locationX),
  });

  const thumbX = valueToX(value);

  return (
    <View
      accessible
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      accessibilityRole="adjustable"
      accessibilityValue={{ max: maximum, min: minimum, now: value, text: `€${value} per week` }}
      onAccessibilityAction={(event) =>
        onChange(event.nativeEvent.actionName === "increment" ? Math.min(maximum, value + step) : Math.max(minimum, value - step))
      }
      style={styles.wrapper}
      {...responder.panHandlers}
    >
      <View style={styles.track} />
      <View pointerEvents="none" style={[styles.thumb, { transform: [{ translateX: thumbX }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { height: THUMB_SIZE, justifyContent: "center", width: TRACK_WIDTH },
  track: { backgroundColor: colors.surface, borderCurve: "continuous", borderRadius: 999, height: 16, width: TRACK_WIDTH },
  thumb: {
    backgroundColor: colors.surface,
    borderCurve: "continuous",
    borderRadius: 999,
    height: THUMB_SIZE,
    left: 0,
    position: "absolute",
    width: THUMB_SIZE,
  },
});
