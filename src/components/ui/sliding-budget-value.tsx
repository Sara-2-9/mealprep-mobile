import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { fontFamilies } from "@/design-system/typography";

type SlidingBudgetValueProps = { value: number };

function SlidingText({ value }: SlidingBudgetValueProps) {
  const [translateY] = useState(() => new Animated.Value(48));

  useEffect(() => {
    const animation = Animated.timing(translateY, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
      toValue: 0,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [translateY]);

  const opacity = translateY.interpolate({ inputRange: [0, 48], outputRange: [1, 0] });
  return <Animated.Text style={[styles.value, styles.layer, { opacity, transform: [{ translateY }] }]}>€{value}</Animated.Text>;
}

export function SlidingBudgetValue({ value }: SlidingBudgetValueProps) {
  const mask = <View style={styles.mask}><SlidingText key={value} value={value} /></View>;

  return (
    <MaskedView
      accessibilityLabel={`€${value}`}
      accessibilityRole="text"
      maskElement={mask}
      style={styles.container}
    >
      <LinearGradient
        colors={["#1A1A1A", "#1A1A1A", "#34C759", "#1A1A1A", "#1A1A1A"]}
        end={{ x: 1, y: 0 }}
        locations={[0, 0.3, 0.5, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        style={styles.gradient}
      />
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  container: { height: 118, width: 300 },
  gradient: { flex: 1 },
  layer: { left: 0, position: "absolute", right: 0, top: 0 },
  mask: { backgroundColor: "transparent", flex: 1, overflow: "hidden" },
  value: {
    color: "#000",
    fontFamily: fontFamilies.semibold,
    fontSize: 96,
    includeFontPadding: false,
    lineHeight: 118,
    textAlign: "center",
  },
});
