import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/themed-colors";

type Step = "confirm-completed" | "choose-action";

export default function OverdueModal({
  visible,
  taskName,
  onCompleted,
  onRemove,
  onReschedule,
  onCancel,
}: {
  visible: boolean;
  taskName?: string;
  onCompleted: () => void;
  onRemove: () => void;
  onReschedule: () => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState<Step>("confirm-completed");

  useEffect(() => {
    if (visible) {
      setStep("confirm-completed");
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          {step === "confirm-completed" ? (
            <>
              <ThemedText type="title" style={styles.modalTitle}>
                {`\"${taskName ?? "This task"}\" is past due.`}
              </ThemedText>
              <ThemedText style={styles.messageText}>
                Was this completed?
              </ThemedText>

              <View style={styles.modalActions}>
                <Pressable
                  style={styles.modalSecondaryButton}
                  onPress={() => setStep("choose-action")}
                >
                  <ThemedText style={styles.modalSecondaryButtonLabel}>
                    No
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={styles.modalPrimaryButton}
                  onPress={onCompleted}
                >
                  <ThemedText style={styles.modalPrimaryButtonLabel}>
                    Yes
                  </ThemedText>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <ThemedText type="title" style={styles.modalTitle}>
                {`What do you want to do with \"${taskName ?? "this task"}\"?`}
              </ThemedText>

              <View style={styles.modalActionsStack}>
                <Pressable
                  style={styles.modalSecondaryButton}
                  onPress={onRemove}
                >
                  <ThemedText style={styles.modalSecondaryButtonLabel}>
                    Remove
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={styles.modalPrimaryButton}
                  onPress={onReschedule}
                >
                  <ThemedText style={styles.modalPrimaryButtonLabel}>
                    Reschedule
                  </ThemedText>
                </Pressable>
              </View>
            </>
          )}
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
  messageText: {
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  modalActionsStack: {
    gap: 10,
    flexDirection: "row",
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
