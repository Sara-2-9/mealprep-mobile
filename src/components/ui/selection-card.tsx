import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { emojiAssets } from "@/design-system/emoji-assets";
import { useColors } from "@/hooks/use-colors";

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
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.transparent,
        },
        selected && {
          backgroundColor: colors.selected,
          borderColor: colors.accent,
        },
      ]}
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
            <AppText
              style={[styles.emojiText, { color: colors.ink }]}
              weight="medium"
            >
              {emoji}
            </AppText>
          )}
        </View>
      ) : null}
      <AppText
        style={[
          styles.label,
          { color: colors.ink },
          !emoji && styles.centeredLabel,
        ]}
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
    borderCurve: "continuous",
    borderRadius: 20,
    borderWidth: 4,
    height: 104,
    justifyContent: "center",
    width: "47.73%",
  },
  emojiDisc: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 44,
  },
  selectedDisc: { transform: [{ scale: 1.06 }] },
  emojiImage: { height: 34, width: 34 },
  emojiText: { fontSize: 32, lineHeight: 36 },
  label: { fontSize: 16, lineHeight: 22, marginTop: 2 },
  centeredLabel: { marginTop: 0, textAlign: "center" },
});
