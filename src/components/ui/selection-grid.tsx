import { StyleSheet, View } from "react-native";

import { SelectionCard } from "./selection-card";

import { toggleExclusiveNone } from "@/domain/preferences";


type Choice<T extends string> = { id: T; label: string; emoji: string };

type SelectionGridProps<T extends string> = {
  choices: readonly Choice<T>[];
  selected: T[];
  onChange: (value: T[]) => void;
};

export function SelectionGrid<T extends string>({ choices, onChange, selected }: SelectionGridProps<T>) {
  return (
    <View style={styles.grid}>
      {choices.map((choice) => (
        <SelectionCard
          emoji={choice.emoji}
          key={choice.id}
          label={choice.label}
          onPress={() => onChange(toggleExclusiveNone(selected, choice.id))}
          selected={selected.includes(choice.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginTop: 79, width: "100%" },
});

