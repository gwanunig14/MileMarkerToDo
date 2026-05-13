import { useMemo, useState } from "react";
import { View, StyleSheet, Pressable, ScrollView, Modal } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/themed-colors";
import { formatMinutesToTime } from "@/lib/format-utils";

interface NotificationSettingsProps {
  type: "todo" | "reminder";
  initialNotificationMinutes?: number;
  initialRepeatEnabled?: boolean;
  initialRepeatEveryMinutes?: number;
  onNotificationMinutesChange: (minutes: number | null) => void;
  onRepeatChange: (enabled: boolean) => void;
  onRepeatEveryChange: (minutes: number) => void;
}

export function NotificationSettings({
  type,
  initialNotificationMinutes,
  initialRepeatEnabled,
  initialRepeatEveryMinutes,
  onNotificationMinutesChange,
  onRepeatChange,
  onRepeatEveryChange,
}: NotificationSettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    initialNotificationMinutes !== undefined &&
      initialNotificationMinutes !== null,
  );
  const [notificationMinutes, setNotificationMinutes] = useState(
    initialNotificationMinutes ?? 30,
  );
  const [repeatEnabled, setRepeatEnabled] = useState(
    initialRepeatEnabled ?? false,
  );
  const [repeatEveryMinutes, setRepeatEveryMinutes] = useState(
    initialRepeatEveryMinutes ?? 5,
  );
  const [showMinutesPicker, setShowMinutesPicker] = useState(false);
  const [showRepeatPicker, setShowRepeatPicker] = useState(false);

  const notificationOptions = useMemo(() => {
    if (type === "todo") {
      // 5 to 120 minutes in 5-minute increments
      return Array.from({ length: 24 }, (_, i) => (i + 1) * 5);
    } else {
      // 15 to 1440 minutes in 15-minute increments
      return Array.from({ length: 96 }, (_, i) => (i + 1) * 15);
    }
  }, [type]);

  const repeatOptions = useMemo(() => {
    // Only show repeat options that are less than the initial notification time
    // and only if initial notification is >= 10 minutes
    if (notificationMinutes < 10) {
      return [];
    }
    const baseOptions = [5, 10, 15, 20, 25, 30];
    return baseOptions.filter((option) => option < notificationMinutes);
  }, [notificationMinutes]);

  const handleNotificationToggle = () => {
    const newEnabled = !notificationsEnabled;
    setNotificationsEnabled(newEnabled);
    onNotificationMinutesChange(newEnabled ? notificationMinutes : null);
  };

  const handleNotificationMinutesSelect = (minutes: number) => {
    setNotificationMinutes(minutes);
    onNotificationMinutesChange(minutes);
    // Reset repeat options if the new selection doesn't support the current repeat
    if (minutes < 10) {
      setRepeatEnabled(false);
      onRepeatChange(false);
    } else if (repeatEveryMinutes >= minutes) {
      setRepeatEveryMinutes(Math.max(5, minutes - 5));
      onRepeatEveryChange(Math.max(5, minutes - 5));
    }
    setShowMinutesPicker(false);
  };

  const handleRepeatToggle = () => {
    const newRepeatEnabled = !repeatEnabled;
    setRepeatEnabled(newRepeatEnabled);
    onRepeatChange(newRepeatEnabled);
  };

  const handleRepeatSelect = (minutes: number) => {
    setRepeatEveryMinutes(minutes);
    onRepeatEveryChange(minutes);
    setShowRepeatPicker(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Pressable style={styles.toggleRow} onPress={handleNotificationToggle}>
          <ThemedText type="subtitle" style={styles.label}>
            Enable Notifications
          </ThemedText>
          <View
            style={[styles.toggle, notificationsEnabled && styles.toggleActive]}
          >
            {notificationsEnabled && (
              <ThemedText style={styles.toggleText}>✓</ThemedText>
            )}
          </View>
        </Pressable>

        {notificationsEnabled && (
          <View style={styles.settingsGroup}>
            <Pressable
              style={styles.selectorButton}
              onPress={() => setShowMinutesPicker(true)}
            >
              <ThemedText type="subtitle" style={styles.selectorLabel}>
                When to notify:{" "}
                {type === "todo"
                  ? `${formatMinutesToTime(notificationMinutes)} before`
                  : `${formatMinutesToTime(notificationMinutes)} after`}
              </ThemedText>
              <ThemedText style={styles.selectorArrow}>▼</ThemedText>
            </Pressable>

            {notificationMinutes >= 10 && (
              <>
                <Pressable
                  style={styles.toggleRow}
                  onPress={handleRepeatToggle}
                >
                  <ThemedText type="subtitle" style={styles.label}>
                    Repeat Notifications
                  </ThemedText>
                  <View
                    style={[
                      styles.toggle,
                      repeatEnabled && styles.toggleActive,
                    ]}
                  >
                    {repeatEnabled && (
                      <ThemedText style={styles.toggleText}>✓</ThemedText>
                    )}
                  </View>
                </Pressable>

                {repeatEnabled && (
                  <Pressable
                    style={styles.selectorButton}
                    onPress={() => setShowRepeatPicker(true)}
                  >
                    <ThemedText type="subtitle" style={styles.selectorLabel}>
                      Repeat every: {formatMinutesToTime(repeatEveryMinutes)}
                    </ThemedText>
                    <ThemedText style={styles.selectorArrow}>▼</ThemedText>
                  </Pressable>
                )}
              </>
            )}
          </View>
        )}
      </View>

      {/* Minutes Picker Modal */}
      <Modal
        visible={showMinutesPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMinutesPicker(false)}
      >
        <View style={styles.pickerBackdrop}>
          <View style={styles.pickerCard}>
            <ThemedText type="subtitle" style={styles.pickerTitle}>
              Select Time
            </ThemedText>
            <ScrollView
              style={styles.pickerScroll}
              showsVerticalScrollIndicator={false}
            >
              {notificationOptions.map((minutes) => (
                <Pressable
                  key={minutes}
                  style={[
                    styles.pickerOption,
                    minutes === notificationMinutes &&
                      styles.pickerOptionSelected,
                  ]}
                  onPress={() => handleNotificationMinutesSelect(minutes)}
                >
                  <ThemedText
                    style={[
                      styles.pickerOptionText,
                      minutes === notificationMinutes &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    {type === "todo"
                      ? `${formatMinutesToTime(minutes)} before`
                      : `${formatMinutesToTime(minutes)} after`}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Repeat Interval Picker Modal */}
      <Modal
        visible={showRepeatPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRepeatPicker(false)}
      >
        <View style={styles.pickerBackdrop}>
          <View style={styles.pickerCard}>
            <ThemedText type="subtitle" style={styles.pickerTitle}>
              Repeat Every
            </ThemedText>
            <ScrollView
              style={styles.pickerScroll}
              showsVerticalScrollIndicator={false}
            >
              {repeatOptions.map((minutes) => (
                <Pressable
                  key={minutes}
                  style={[
                    styles.pickerOption,
                    minutes === repeatEveryMinutes &&
                      styles.pickerOptionSelected,
                  ]}
                  onPress={() => handleRepeatSelect(minutes)}
                >
                  <ThemedText
                    style={[
                      styles.pickerOptionText,
                      minutes === repeatEveryMinutes &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    {formatMinutesToTime(minutes)}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  section: {
    gap: 12,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  label: {
    fontWeight: "600",
  },
  toggle: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.borderInput,
    backgroundColor: Colors.surfaceInput,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  toggleText: {
    color: Colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  settingsGroup: {
    gap: 12,
    marginLeft: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: Colors.borderInput,
  },
  selectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceInput,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderInput,
  },
  selectorLabel: {
    flex: 1,
    fontWeight: "500",
    fontSize: 13,
  },
  selectorArrow: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: Colors.backdropModal,
    justifyContent: "center",
    padding: 20,
  },
  pickerCard: {
    backgroundColor: Colors.surfaceModal,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    maxHeight: "70%",
  },
  pickerTitle: {
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  pickerScroll: {
    maxHeight: "100%",
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderRow,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.accent,
  },
  pickerOptionText: {
    color: Colors.textPrimary,
  },
  pickerOptionTextSelected: {
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});
