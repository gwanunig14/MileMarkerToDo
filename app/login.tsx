import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/themed-colors";
import {
  getCurrentUser,
  loadUsers,
  saveUsers,
  setCurrentUser,
} from "@/lib/auth";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const trimmedUsername = useMemo(() => username.trim(), [username]);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const currentUser = await getCurrentUser();
      if (isMounted && currentUser) {
        router.replace("/todo");
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async () => {
    setError("");

    if (!trimmedUsername || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const users = await loadUsers();
      const existingPassword = users[trimmedUsername];

      if (existingPassword !== undefined) {
        if (existingPassword !== password) {
          setError("Incorrect password for this username.");
          return;
        }

        await setCurrentUser(trimmedUsername);
        router.replace("/todo");
        return;
      }

      if (!showConfirm) {
        setShowConfirm(true);
        setError("New username detected. Please confirm your password.");
        return;
      }

      if (!confirmPassword) {
        setError("Please confirm your password.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      users[trimmedUsername] = password;
      await saveUsers(users);
      await setCurrentUser(trimmedUsername);
      router.replace("/todo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      locations={[0, 1]}
    >
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          To-Do Login
        </ThemedText>

        <TextInput
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setShowConfirm(false);
            setConfirmPassword("");
            setError("");
          }}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Username"
          placeholderTextColor={Colors.textPlaceholder}
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Password"
          placeholderTextColor={Colors.textPlaceholder}
          style={styles.input}
        />

        {showConfirm ? (
          <TextInput
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError("");
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.textPlaceholder}
            style={styles.input}
          />
        ) : null}

        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}

        <Pressable
          style={styles.button}
          onPress={onSubmit}
          disabled={isSubmitting}
        >
          <ThemedText style={styles.buttonLabel}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </ThemedText>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 12,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    shadowColor: Colors.black,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: Colors.surfaceInput,
    color: Colors.textPrimary,
  },
  errorText: {
    color: Colors.textError,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonLabel: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },
});
