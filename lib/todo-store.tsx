import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { getCurrentUser } from "@/lib/auth";
import {
  scheduleNotificationsForToDo,
  scheduleNotificationsForReminder,
  cancelNotifications,
  type NotificationSettings,
} from "@/lib/notifications";

export type { NotificationSettings };

export type Priority = "low" | "med" | "high";

export type TodoItem = {
  title: string;
  dueDate: string;
  priority: Priority;
  notificationSettings?: NotificationSettings;
  notificationIds?: string[]; // Multiple notification IDs for repeated notifications
};

export type Reminder = {
  title: string;
  createdAt: string;
  notificationSettings?: NotificationSettings;
  notificationIds?: string[]; // Multiple notification IDs for repeated notifications
};

type TodoStoreValue = {
  items: TodoItem[];
  reminders: Reminder[];
  addItem: (item: TodoItem) => void;
  removeItem: (item: TodoItem) => void;
  addReminder: (reminder: Reminder) => void;
  removeReminder: (reminder: Reminder) => void;
  refreshItemsForCurrentUser: () => Promise<void>;
};

const TodoStoreContext = createContext<TodoStoreValue | null>(null);

const TODOS_BY_USER_STORAGE_KEY = "mm_todos_by_user";
const REMINDERS_BY_USER_STORAGE_KEY = "mm_reminders_by_user";

type TodosByUser = Record<string, TodoItem[]>;
type RemindersByUser = Record<string, Reminder[]>;

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

async function loadTodosByUser(): Promise<TodosByUser> {
  const value = await readValue(TODOS_BY_USER_STORAGE_KEY);
  if (!value) {
    return {};
  }

  try {
    return JSON.parse(value) as TodosByUser;
  } catch {
    return {};
  }
}

async function saveTodosByUser(data: TodosByUser): Promise<void> {
  await writeValue(TODOS_BY_USER_STORAGE_KEY, JSON.stringify(data));
}

async function loadRemindersByUser(): Promise<RemindersByUser> {
  const value = await readValue(REMINDERS_BY_USER_STORAGE_KEY);
  if (!value) {
    return {};
  }

  try {
    return JSON.parse(value) as RemindersByUser;
  } catch {
    return {};
  }
}

async function saveRemindersByUser(data: RemindersByUser): Promise<void> {
  await writeValue(REMINDERS_BY_USER_STORAGE_KEY, JSON.stringify(data));
}

export function TodoStoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const refreshItemsForCurrentUser = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      setItems([]);
      setReminders([]);
      return;
    }

    const allTodos = await loadTodosByUser();
    const allReminders = await loadRemindersByUser();
    setItems(allTodos[currentUser] ?? []);
    setReminders(allReminders[currentUser] ?? []);
  };

  useEffect(() => {
    void refreshItemsForCurrentUser();
  }, []);

  const value = useMemo<TodoStoreValue>(
    () => ({
      items,
      reminders,
      addItem: (item: TodoItem) => {
        const trimmedTitle = item.title.trim();
        if (!trimmedTitle) {
          return;
        }

        setItems((current) => {
          void (async () => {
            const notificationIds = await scheduleNotificationsForToDo(
              trimmedTitle,
              item.dueDate,
              item.notificationSettings,
            );

            const nextItems = [
              ...current,
              {
                title: trimmedTitle,
                dueDate: item.dueDate,
                priority: item.priority,
                notificationSettings: item.notificationSettings,
                notificationIds:
                  notificationIds.length > 0 ? notificationIds : undefined,
              },
            ];

            const currentUser = await getCurrentUser();
            if (!currentUser) {
              return;
            }

            const allTodos = await loadTodosByUser();
            allTodos[currentUser] = nextItems;
            await saveTodosByUser(allTodos);

            setItems(nextItems);
          })();

          return current;
        });
      },
      removeItem: (item: TodoItem) => {
        setItems((current) => {
          const removeIndex = current.findIndex(
            (candidate) =>
              candidate.title === item.title &&
              candidate.dueDate === item.dueDate &&
              candidate.priority === item.priority,
          );

          if (removeIndex < 0) {
            return current;
          }

          const removedItem = current[removeIndex];
          if (
            removedItem.notificationIds &&
            removedItem.notificationIds.length > 0
          ) {
            void cancelNotifications(removedItem.notificationIds);
          }

          const nextItems = [
            ...current.slice(0, removeIndex),
            ...current.slice(removeIndex + 1),
          ];

          void (async () => {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
              return;
            }

            const allTodos = await loadTodosByUser();
            allTodos[currentUser] = nextItems;
            await saveTodosByUser(allTodos);
          })();

          return nextItems;
        });
      },
      addReminder: (reminder: Reminder) => {
        const trimmedTitle = reminder.title.trim();
        if (!trimmedTitle) {
          return;
        }

        setReminders((current) => {
          void (async () => {
            const createdAt = new Date().toISOString();
            const notificationIds = await scheduleNotificationsForReminder(
              trimmedTitle,
              createdAt,
              reminder.notificationSettings,
            );

            const nextReminders = [
              ...current,
              {
                title: trimmedTitle,
                createdAt: createdAt,
                notificationSettings: reminder.notificationSettings,
                notificationIds:
                  notificationIds.length > 0 ? notificationIds : undefined,
              },
            ];

            const currentUser = await getCurrentUser();
            if (!currentUser) {
              return;
            }

            const allReminders = await loadRemindersByUser();
            allReminders[currentUser] = nextReminders;
            await saveRemindersByUser(allReminders);

            setReminders(nextReminders);
          })();

          return current;
        });
      },
      removeReminder: (reminder: Reminder) => {
        setReminders((current) => {
          const removeIndex = current.findIndex(
            (candidate) =>
              candidate.title === reminder.title &&
              candidate.createdAt === reminder.createdAt,
          );

          if (removeIndex < 0) {
            return current;
          }

          const removedReminder = current[removeIndex];
          if (
            removedReminder.notificationIds &&
            removedReminder.notificationIds.length > 0
          ) {
            void cancelNotifications(removedReminder.notificationIds);
          }

          const nextReminders = [
            ...current.slice(0, removeIndex),
            ...current.slice(removeIndex + 1),
          ];

          void (async () => {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
              return;
            }

            const allReminders = await loadRemindersByUser();
            allReminders[currentUser] = nextReminders;
            await saveRemindersByUser(allReminders);
          })();

          return nextReminders;
        });
      },
      refreshItemsForCurrentUser,
    }),
    [items, reminders, setItems, setReminders],
  );

  return (
    <TodoStoreContext.Provider value={value}>
      {children}
    </TodoStoreContext.Provider>
  );
}

export function useTodoStore(): TodoStoreValue {
  const value = useContext(TodoStoreContext);

  if (!value) {
    throw new Error("useTodoStore must be used within TodoStoreProvider");
  }

  return value;
}
