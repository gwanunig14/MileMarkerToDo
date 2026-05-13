import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { clearCurrentUser, getCurrentUser } from "@/lib/auth";
import { TodoItem, Reminder, useTodoStore } from "@/lib/todo-store";
import { Colors } from "@/constants/themed-colors";
import { requestNotificationPermissions } from "@/lib/notifications";
import TaskModal from "./task-modal";
import RemoveModal from "./remove-modal";
import OverdueModal from "./overdue-modal";
import { LinearGradient } from "expo-linear-gradient";

export default function TodoListScreen() {
  const [currentUser, setCurrentUserName] = useState<string | null>(null);
  const {
    items,
    reminders,
    removeItem,
    removeReminder,
    refreshItemsForCurrentUser,
  } = useTodoStore();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isTaskComplete, setIsTaskComplete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<null | TodoItem>(null);
  const [selectedReminder, setSelectedReminder] = useState<null | Reminder>(
    null,
  );
  const [hasInitialLoadCompleted, setHasInitialLoadCompleted] = useState(false);
  const [hasPromptedForOverdue, setHasPromptedForOverdue] = useState(false);
  const [isOverdueModalVisible, setIsOverdueModalVisible] = useState(false);
  const [overdueItem, setOverdueItem] = useState<TodoItem | null>(null);
  const [rescheduleOriginalItem, setRescheduleOriginalItem] =
    useState<TodoItem | null>(null);
  const [pendingRemoveAction, setPendingRemoveAction] = useState<
    "remove" | "cancel" | null
  >(null);
  const [isReminderListExpanded, setIsReminderListExpanded] = useState(true);
  const [isTodoListExpanded, setIsTodoListExpanded] = useState(true);

  const sortedItems = useMemo(() => {
    const priorityWeight = {
      high: 3,
      med: 2,
      low: 1,
    } as const;

    return [...items].sort((a, b) => {
      const dueDelta =
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (dueDelta !== 0) {
        return dueDelta;
      }

      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  }, [items]);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const username = await getCurrentUser();
      if (!username) {
        router.replace("/login");
        return;
      }

      if (isMounted) {
        setCurrentUserName(username);
      }

      await requestNotificationPermissions();
      await refreshItemsForCurrentUser();

      if (isMounted) {
        setHasInitialLoadCompleted(true);
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [refreshItemsForCurrentUser]);

  const onAdd = () => {
    setRescheduleOriginalItem(null);
    setIsAddModalVisible(true);
  };

  const onLogout = async () => {
    await clearCurrentUser();
    router.replace("/login");
  };

  const runPendingRemoveAction = useCallback(() => {
    if (pendingRemoveAction === "remove") {
      if (selectedItem) {
        removeItem(selectedItem);
      } else if (selectedReminder) {
        removeReminder(selectedReminder);
      }
    }

    setPendingRemoveAction(null);
    setIsTaskComplete(false);
    setSelectedItem(null);
    setSelectedReminder(null);
  }, [
    pendingRemoveAction,
    removeItem,
    removeReminder,
    selectedItem,
    selectedReminder,
  ]);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    if (isTaskComplete || !pendingRemoveAction) {
      return;
    }

    const timeoutId = setTimeout(() => {
      runPendingRemoveAction();
    }, 220);

    return () => clearTimeout(timeoutId);
  }, [isTaskComplete, pendingRemoveAction, runPendingRemoveAction]);

  useEffect(() => {
    if (!hasInitialLoadCompleted || hasPromptedForOverdue) {
      return;
    }

    const now = Date.now();
    const firstOverdue = sortedItems.find(
      (item) => new Date(item.dueDate).getTime() < now,
    );

    if (firstOverdue) {
      setOverdueItem(firstOverdue);
      setIsOverdueModalVisible(true);
    }

    setHasPromptedForOverdue(true);
  }, [hasInitialLoadCompleted, hasPromptedForOverdue, sortedItems]);

  // Collapse reminder list if empty
  useEffect(() => {
    if (reminders.length === 0) {
      setIsReminderListExpanded(false);
    }
  }, [reminders.length]);

  // Collapse todo list if empty
  useEffect(() => {
    if (sortedItems.length === 0) {
      setIsTodoListExpanded(false);
    }
  }, [sortedItems.length]);

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      locations={[0, 1]}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <Pressable onPress={onLogout}>
          <ThemedText style={styles.logoutButtonLabel}>Log Out</ThemedText>
        </Pressable>
      </View>
      <View style={styles.listHeader}>
        <ThemedText type="title" style={styles.title}>
          {`${currentUser}'s To-Do List`}
        </ThemedText>
        {(sortedItems.length > 0 || reminders.length > 0) && (
          <Pressable style={styles.addButton} onPress={onAdd}>
            <ThemedText style={styles.addButtonLabel}>Add</ThemedText>
          </Pressable>
        )}
      </View>

      {/* Reminder List Section */}
      <View style={styles.collapsibleSection}>
        <Pressable
          style={styles.sectionHeader}
          onPress={() => setIsReminderListExpanded(!isReminderListExpanded)}
        >
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Reminder List ({reminders.length})
          </ThemedText>
          <ThemedText style={styles.expandIcon}>
            {isReminderListExpanded ? "▼" : "▶"}
          </ThemedText>
        </Pressable>
        {isReminderListExpanded && (
          <View style={styles.listContent}>
            {reminders.length === 0 ? (
              <ThemedText style={styles.emptyText}>No reminders yet</ThemedText>
            ) : (
              reminders.map((reminder, index) => (
                <Pressable
                  key={`${reminder.title}-${reminder.createdAt}-${index}`}
                  style={styles.item}
                  onPress={() => {
                    setSelectedReminder(reminder);
                    setSelectedItem(null);
                    setIsTaskComplete(true);
                  }}
                >
                  <View style={styles.checkoff} />
                  <View style={styles.itemText}>
                    <ThemedText type="subtitle">{reminder.title}</ThemedText>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        )}
      </View>

      {/* To-Do List Section */}
      <View style={styles.collapsibleSection}>
        <Pressable
          style={styles.sectionHeader}
          onPress={() => setIsTodoListExpanded(!isTodoListExpanded)}
        >
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            To-Do List ({sortedItems.length})
          </ThemedText>
          <ThemedText style={styles.expandIcon}>
            {isTodoListExpanded ? "▼" : "▶"}
          </ThemedText>
        </Pressable>
        {isTodoListExpanded && (
          <View style={styles.listContent}>
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
                <Pressable
                  key={`${item.title}-${item.dueDate}-${index}`}
                  style={styles.item}
                  onPress={() => {
                    setSelectedItem(item);
                    setSelectedReminder(null);
                    setIsTaskComplete(true);
                  }}
                >
                  <View style={styles.checkoff} />
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
                </Pressable>
              ))
            )}
          </View>
        )}
      </View>

      <RemoveModal
        visible={isTaskComplete}
        taskName={selectedItem?.title ?? selectedReminder?.title}
        removeTask={() => {
          setPendingRemoveAction("remove");
          setIsTaskComplete(false);
        }}
        cancel={() => {
          setPendingRemoveAction("cancel");
          setIsTaskComplete(false);
        }}
        onAfterDismiss={() => {
          if (Platform.OS !== "android" && pendingRemoveAction) {
            runPendingRemoveAction();
          }
        }}
      />

      <OverdueModal
        visible={isOverdueModalVisible}
        taskName={overdueItem?.title}
        onCompleted={() => {
          if (overdueItem) {
            removeItem(overdueItem);
          }
          setIsOverdueModalVisible(false);
          setOverdueItem(null);
        }}
        onRemove={() => {
          if (overdueItem) {
            removeItem(overdueItem);
          }
          setIsOverdueModalVisible(false);
          setOverdueItem(null);
        }}
        onReschedule={() => {
          if (!overdueItem) {
            setIsOverdueModalVisible(false);
            return;
          }

          setRescheduleOriginalItem(overdueItem);
          setIsOverdueModalVisible(false);
          setIsAddModalVisible(true);
        }}
        onCancel={() => {
          setIsOverdueModalVisible(false);
          setOverdueItem(null);
        }}
      />

      <TaskModal
        visible={isAddModalVisible}
        initialTitle={rescheduleOriginalItem?.title}
        onSave={() => {
          if (rescheduleOriginalItem) {
            removeItem(rescheduleOriginalItem);
            setRescheduleOriginalItem(null);
          }
        }}
        dismiss={() => {
          setIsAddModalVisible(false);
          setRescheduleOriginalItem(null);
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 56,
    gap: 16,
  },
  title: {},
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  listHeader: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
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
  logoutButtonLabel: {
    fontWeight: "600",
  },
  collapsibleSection: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.surfaceRow,
    borderWidth: 1,
    borderColor: Colors.borderRow,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  expandIcon: {
    fontSize: 12,
    fontWeight: "600",
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
  longButton: {
    height: 48,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
});
