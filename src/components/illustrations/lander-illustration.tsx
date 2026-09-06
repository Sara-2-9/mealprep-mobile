import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { emojiAssets } from "@/design-system/emoji-assets";

const foods = [
  { emoji: "🍎", left: 48, top: 0, rotate: "-18deg" },
  { emoji: "🧀", left: 5, top: 120, rotate: "12deg" },
  { emoji: "🌽", left: 53, top: 258, rotate: "-8deg" },
  { emoji: "🍆", left: 174, top: 295, rotate: "14deg" },
  { emoji: "🫒", left: 284, top: 238, rotate: "-12deg" },
  { emoji: "🥕", left: 292, top: 87, rotate: "18deg" },
  { emoji: "🥩", left: 214, top: -17, rotate: "10deg" },
] as const;

export function LanderIllustration() {
  const [float] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { duration: 1500, easing: Easing.inOut(Easing.quad), toValue: -8, useNativeDriver: true }),
        Animated.timing(float, { duration: 1500, easing: Easing.inOut(Easing.quad), toValue: 0, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [float]);

  return (
    <View accessibilityLabel="A grocery bag surrounded by fresh foods" style={styles.scene}>
      {foods.map((food) => (
        <View key={food.emoji} style={[styles.food, { left: food.left, top: food.top, transform: [{ rotate: food.rotate }] }]}>
          <Image contentFit="contain" source={emojiAssets[food.emoji]} style={styles.emoji} />
        </View>
      ))}
      <Animated.View style={[styles.bag, { transform: [{ translateY: float }] }]}>
        <Image contentFit="contain" source={require("../../../assets/images/mealprep-bag.png")} style={styles.image} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: { height: 335, position: "relative", width: 345 },
  bag: { height: 200, left: 73, position: "absolute", top: 40, width: 200 },
  image: { height: 200, width: 200 },
  food: { position: "absolute" },
  emoji: { height: 44, width: 44 },
});
