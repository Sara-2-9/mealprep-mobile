import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { fontFamilies } from "@/design-system/typography";
import { useColors } from "@/hooks/use-colors";

type SlidingBudgetValueProps = { value: number };

export function SlidingBudgetValue({ value }: SlidingBudgetValueProps) {
  const colors = useColors();
  const [gradientProgress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(gradientProgress, {
        duration: 3600,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [gradientProgress]);

  const translateX = gradientProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });
  const mask = (
    <View style={[styles.mask, { backgroundColor: colors.transparent }]}>
      <Animated.Text style={[styles.value, { color: colors.mask }]}>
        €{value}
      </Animated.Text>
    </View>
  );

  return (
    <MaskedView
      accessibilityLabel={`€${value}`}
      accessibilityRole="text"
      maskElement={mask}
      style={styles.container}
    >
      <Animated.View
        style={[styles.gradientTrack, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={colors.budgetShine}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.25, 0.5, 0.75, 1]}
          start={{ x: 0, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  container: { height: 118, width: 300 },
  gradient: { flex: 1 },
  gradientTrack: {
    bottom: 0,
    left: -300,
    position: "absolute",
    top: 0,
    width: 600,
  },
  mask: { flex: 1, overflow: "hidden" },
  value: {
    fontFamily: fontFamilies.semibold,
    fontSize: 96,
    includeFontPadding: false,
    lineHeight: 118,
    textAlign: "center",
  },
});
