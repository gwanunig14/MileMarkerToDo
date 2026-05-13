import { Pressable, StyleSheet, View } from "react-native";
import { Priority } from "@/lib/todo-store";
import { Colors } from "@/constants/themed-colors";

export default function PriorityButton({
  selected,
  priority,
  setPriority,
}: {
  selected: boolean;
  priority: Priority;
  setPriority: (priority: Priority) => void;
}) {
  let backgroundColor;
  switch (priority) {
    case "low":
      backgroundColor = Colors.priorityLow;
      break;
    case "med":
      backgroundColor = Colors.priorityMed;
      break;
    case "high":
      backgroundColor = Colors.priorityHigh;
      break;
    default:
      backgroundColor = Colors.priorityLow;
      break;
  }

  return (
    <Pressable
      style={styles(selected).priorityButton}
      onPress={() => setPriority(priority)}
    >
      <View style={[styles(selected).interior, { backgroundColor }]} />
    </Pressable>
  );
}

const styles = (selected: boolean) => {
  return StyleSheet.create({
    priorityButton: {
      borderRadius: 999,
      height: 46,
      width: 46,
      borderWidth: selected ? 2 : 0,
      borderColor: Colors.borderChip,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.surfaceChip,
    },
    interior: {
      borderRadius: 999,
      height: selected ? 40 : 46,
      width: selected ? 40 : 46,
    },
  });
};
