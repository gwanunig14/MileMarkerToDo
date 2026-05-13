import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/themed-colors";
import { TodoItem } from "@/lib/todo-store";

type TodoScrollViewProps = {
  sortedItems: TodoItem[];
  onAdd: () => void;
  onSelectItem: (item: TodoItem) => void;
};

export default function TodoScrollView({
  sortedItems,
  onAdd,
  onSelectItem,
}: TodoScrollViewProps) {
  return (
    <ScrollView
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    >
      {sortedItems.length === 0 ? (
        <Pressable
          style={[styles.addButton, styles.longButton]}
          onPress={onAdd}
        >
          <ThemedText type="title" style={styles.addButtonLabel}>
            Add New To-Do
          </ThemedText>
        </Pressable>
      ) : (
        sortedItems.map((item, index) => (
          <View
            key={`${item.title}-${item.dueDate}-${index}`}
            style={styles.item}
          >
            <Pressable
              style={styles.checkoff}
              onPress={() => onSelectItem(item)}
            />
            <View style={styles.itemText}>
              <ThemedText type="subtitle">{item.title}</ThemedText>
              <ThemedText type="subtitle" style={styles.dueDate}>
                Due{" "}
                {new Date(item.dueDate).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </ThemedText>
            </View>
            <View style={[styles.priority, styles[item.priority]]} />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: Colors.black,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  addButtonLabel: {
    color: Colors.textPrimary,
    textAlign: "center",
    fontWeight: "600",
  },
  longButton: {
    height: 48,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 8,
  },
  item: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minHeight: 54,
    backgroundColor: Colors.surfaceRow,
    borderWidth: 1,
    borderColor: Colors.borderRow,
    borderRadius: 14,
  },
  checkoff: {
    height: 18,
    width: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.borderCheckoff,
    marginRight: 12,
    backgroundColor: Colors.surfaceCheckoff,
  },
  itemText: {
    flex: 1,
    minWidth: 0,
  },
  priority: {
    borderRadius: 999,
    height: 28,
    width: 28,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: Colors.borderChip,
  },
  low: {
    backgroundColor: Colors.priorityLow,
  },
  med: {
    backgroundColor: Colors.priorityMed,
  },
  high: {
    backgroundColor: Colors.priorityHigh,
  },
  dueDate: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});
