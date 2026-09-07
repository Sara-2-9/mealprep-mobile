import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { emojiAssets } from "@/design-system/emoji-assets";
import { colors } from "@/design-system/tokens";

type SelectionCardProps = {
  emoji?: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectionCard({
  emoji,
  label,
  onPress,
  selected,
}: SelectionCardProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.card, selected && styles.selected]}
    >
      {emoji ? (
        <View style={[styles.emojiDisc, selected && styles.selectedDisc]}>
          {emojiAssets[emoji] ? (
            <Image
              contentFit="contain"
              source={emojiAssets[emoji]}
              style={styles.emojiImage}
            />
          ) : (
            <AppText style={styles.emojiText} weight="medium">
              {emoji}
            </AppText>
          )}
        </View>
      ) : null}
      <AppText
        style={[styles.label, !emoji && styles.centeredLabel]}
        weight="medium"
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "transparent",
    borderCurve: "continuous",
    borderRadius: 20,
    borderWidth: 4,
    height: 104,
    justifyContent: "center",
    width: "47.73%",
  },
  selected: { backgroundColor: "#E8F9EC", borderColor: colors.accent },
  emojiDisc: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 44,
  },
  selectedDisc: { transform: [{ scale: 1.06 }] },
  emojiImage: { height: 34, width: 34 },
  emojiText: { color: colors.ink, fontSize: 32, lineHeight: 36 },
  label: { color: colors.ink, fontSize: 16, lineHeight: 22, marginTop: 2 },
  centeredLabel: { marginTop: 0, textAlign: "center" },
});
