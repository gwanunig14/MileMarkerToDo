import { Modal, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/themed-colors";

export default function RemoveModal({
  visible,
  taskName,
  removeTask,
  cancel,
  onAfterDismiss,
}: {
  visible: boolean;
  taskName?: string;
  removeTask: () => void;
  cancel: () => void;
  onAfterDismiss?: () => void;
}) {
  const onDismiss = () => {
    cancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      onDismiss={onAfterDismiss}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <ThemedText type="title" style={styles.modalTitle}>
            {`${taskName} Completed?`}
          </ThemedText>

          <View style={styles.modalActions}>
            <Pressable style={styles.modalSecondaryButton} onPress={onDismiss}>
              <ThemedText
                type="subtitle"
                style={styles.modalSecondaryButtonLabel}
              >
                Cancel
              </ThemedText>
            </Pressable>
            <Pressable style={styles.modalPrimaryButton} onPress={removeTask}>
              <ThemedText
                type="subtitle"
                style={styles.modalPrimaryButtonLabel}
              >
                Task Complete
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
    gap: 16,
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
  },
  modalTitle: {
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
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
