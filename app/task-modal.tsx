import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
  Priority,
  useTodoStore,
  type NotificationSettings,
} from "@/lib/todo-store";
import PriorityButton from "@/components/ui/priority-button";
import { NotificationSettings as NotificationSettingsComponent } from "@/components/notification-settings";
import { Colors } from "@/constants/themed-colors";

export default function TaskModal({
  visible,
  dismiss,
  initialTitle,
  onSave,
}: {
  visible: boolean;
  dismiss: () => void;
  initialTitle?: string;
  onSave?: () => void;
}) {
  const { addItem, addReminder } = useTodoStore();
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState<Priority>("low");
  const [modalMode, setModalMode] = useState<"todo" | "reminder">("todo");
  const [todoNotificationSettings, setTodoNotificationSettings] =
    useState<NotificationSettings>({
      enabled: false,
      minutesBefore: 30,
      repeatEnabled: false,
      repeatEveryMinutes: null,
    });
  const [reminderNotificationSettings, setReminderNotificationSettings] =
    useState<NotificationSettings>({
      enabled: false,
      minutesAfter: 15,
      minutesBefore: null,
      repeatEnabled: false,
      repeatEveryMinutes: null,
    });

  useEffect(() => {
    if (!visible) {
      return;
    }

    setNewTask(initialTitle ?? "");
  }, [initialTitle, visible]);

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) {
      return;
    }

    setDueDate((current) => {
      const date = new Date(current);
      date.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      return date;
    });
  };

  const onTimeChange = (_event: DateTimePickerEvent, selectedTime?: Date) => {
    if (!selectedTime) {
      return;
    }

    setDueDate((current) => {
      const time = new Date(current);
      time.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      return time;
    });
  };

  const onDismiss = () => {
    setNewTask("");
    setDueDate(new Date());
    setModalMode("todo");
    setTodoNotificationSettings({
      enabled: false,
      minutesBefore: 30,
      repeatEnabled: false,
      repeatEveryMinutes: null,
    });
    setReminderNotificationSettings({
      enabled: false,
      minutesAfter: 15,
      minutesBefore: null,
      repeatEnabled: false,
      repeatEveryMinutes: null,
    });
    dismiss();
  };

  const onSaveTask = () => {
    const trimmed = newTask.trim();
    if (!trimmed) {
      return;
    }

    if (modalMode === "reminder") {
      addReminder({
        title: trimmed,
        createdAt: new Date().toISOString(),
        notificationSettings: reminderNotificationSettings,
      });
    } else {
      addItem({
        title: trimmed,
        dueDate: dueDate.toISOString(),
        priority: priority,
        notificationSettings: todoNotificationSettings,
      });
    }
    onSave?.();
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            <View style={styles.toggleContainer}>
              <Pressable
                style={[
                  styles.toggleButton,
                  modalMode === "todo" && styles.toggleButtonActive,
                ]}
                onPress={() => setModalMode("todo")}
              >
                <ThemedText
                  type="subtitle"
                  style={[
                    styles.toggleLabel,
                    modalMode === "todo" && styles.toggleLabelActive,
                  ]}
                >
                  New To-Do
                </ThemedText>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleButton,
                  modalMode === "reminder" && styles.toggleButtonActive,
                ]}
                onPress={() => setModalMode("reminder")}
              >
                <ThemedText
                  type="subtitle"
                  style={[
                    styles.toggleLabel,
                    modalMode === "reminder" && styles.toggleLabelActive,
                  ]}
                >
                  Reminder
                </ThemedText>
              </Pressable>
            </View>

            <TextInput
              value={newTask}
              onChangeText={setNewTask}
              placeholder="Enter a task"
              placeholderTextColor={Colors.textPlaceholder}
              style={styles.modalInput}
              autoFocus
            />

            {modalMode === "todo" && (
              <>
                <View style={styles.category}>
                  <ThemedText type="subtitle" style={styles.categoryLabel}>
                    Due Date:
                  </ThemedText>
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                    themeVariant="dark"
                    textColor={Colors.textPrimary}
                    accentColor={Colors.accent}
                  />
                  <DateTimePicker
                    value={dueDate}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                    minuteInterval={5}
                    themeVariant="dark"
                    textColor={Colors.textPrimary}
                    accentColor={Colors.accent}
                  />
                </View>
                <View style={styles.category}>
                  <ThemedText type="subtitle" style={styles.categoryLabel}>
                    Priority:
                  </ThemedText>
                  <PriorityButton
                    selected={priority === "low"}
                    priority="low"
                    setPriority={setPriority}
                  />
                  <PriorityButton
                    selected={priority === "med"}
                    priority="med"
                    setPriority={setPriority}
                  />
                  <PriorityButton
                    selected={priority === "high"}
                    priority="high"
                    setPriority={setPriority}
                  />
                </View>

                <NotificationSettingsComponent
                  type="todo"
                  initialNotificationMinutes={
                    todoNotificationSettings.minutesBefore ?? undefined
                  }
                  initialRepeatEnabled={todoNotificationSettings.repeatEnabled}
                  initialRepeatEveryMinutes={
                    todoNotificationSettings.repeatEveryMinutes ?? undefined
                  }
                  onNotificationMinutesChange={(minutes) =>
                    setTodoNotificationSettings(
                      (prev: NotificationSettings) => ({
                        ...prev,
                        minutesBefore: minutes,
                        enabled: minutes !== null,
                      }),
                    )
                  }
                  onRepeatChange={(enabled) =>
                    setTodoNotificationSettings(
                      (prev: NotificationSettings) => ({
                        ...prev,
                        repeatEnabled: enabled,
                      }),
                    )
                  }
                  onRepeatEveryChange={(minutes) =>
                    setTodoNotificationSettings(
                      (prev: NotificationSettings) => ({
                        ...prev,
                        repeatEveryMinutes: minutes,
                      }),
                    )
                  }
                />
              </>
            )}

            {modalMode === "reminder" && (
              <NotificationSettingsComponent
                type="reminder"
                initialNotificationMinutes={
                  reminderNotificationSettings.minutesAfter ?? undefined
                }
                initialRepeatEnabled={
                  reminderNotificationSettings.repeatEnabled
                }
                initialRepeatEveryMinutes={
                  reminderNotificationSettings.repeatEveryMinutes ?? undefined
                }
                onNotificationMinutesChange={(minutes) =>
                  setReminderNotificationSettings(
                    (prev: NotificationSettings) => ({
                      ...prev,
                      minutesAfter: minutes,
                      enabled: minutes !== null,
                    }),
                  )
                }
                onRepeatChange={(enabled) =>
                  setReminderNotificationSettings(
                    (prev: NotificationSettings) => ({
                      ...prev,
                      repeatEnabled: enabled,
                    }),
                  )
                }
                onRepeatEveryChange={(minutes) =>
                  setReminderNotificationSettings(
                    (prev: NotificationSettings) => ({
                      ...prev,
                      repeatEveryMinutes: minutes,
                    }),
                  )
                }
              />
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <Pressable style={styles.modalSecondaryButton} onPress={onDismiss}>
              <ThemedText
                type="subtitle"
                style={styles.modalSecondaryButtonLabel}
              >
                Cancel
              </ThemedText>
            </Pressable>
            <Pressable style={styles.modalPrimaryButton} onPress={onSaveTask}>
              <ThemedText
                type="subtitle"
                style={styles.modalPrimaryButtonLabel}
              >
                Save
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.backdropModal,
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    flex: 1,
    maxHeight: "80%",
    backgroundColor: Colors.surfaceModal,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    shadowColor: Colors.black,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    flexDirection: "column",
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    gap: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceInput,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  toggleButtonActive: {
    backgroundColor: Colors.accent,
  },
  toggleLabel: {
    fontWeight: "600",
  },
  toggleLabelActive: {
    color: Colors.textPrimary,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceInput,
    color: Colors.textPrimary,
  },
  category: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  categoryLabel: {},
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderCard,
  },
  modalSecondaryButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.surfaceInput,
    borderWidth: 1,
    borderColor: Colors.borderCard,
  },
  modalSecondaryButtonLabel: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  modalPrimaryButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.accent,
  },
  modalPrimaryButtonLabel: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },
});
