import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const USERS_STORAGE_KEY = "mm_users";
const CURRENT_USER_STORAGE_KEY = "mm_current_user";

type UsersMap = Record<string, string>;

async function readValue(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return globalThis.localStorage?.getItem(key) ?? null;
  }

  return SecureStore.getItemAsync(key);
}

async function writeValue(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function deleteValue(key: string): Promise<void> {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

export async function loadUsers(): Promise<UsersMap> {
  const value = await readValue(USERS_STORAGE_KEY);
  if (!value) {
    return {};
  }

  try {
    return JSON.parse(value) as UsersMap;
  } catch {
    return {};
  }
}

export async function saveUsers(users: UsersMap): Promise<void> {
  await writeValue(USERS_STORAGE_KEY, JSON.stringify(users));
}

export async function getCurrentUser(): Promise<string | null> {
  return readValue(CURRENT_USER_STORAGE_KEY);
}

export async function setCurrentUser(username: string): Promise<void> {
  await writeValue(CURRENT_USER_STORAGE_KEY, username);
}

export async function clearCurrentUser(): Promise<void> {
  await deleteValue(CURRENT_USER_STORAGE_KEY);
}
