import * as Notifications from "expo-notifications";

export type NotificationSettings = {
  enabled: boolean;
  minutesBefore?: number | null; // for to-do
  minutesAfter?: number | null; // for reminder
  repeatEnabled: boolean;
  repeatEveryMinutes: number | null;
};

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const newStatus = await Notifications.requestPermissionsAsync();
      return newStatus.status === "granted";
    }
    return true;
  } catch (error) {
    console.error("Failed to request notification permissions:", error);
    return false;
  }
}

export async function scheduleNotificationsForToDo(
  title: string,
  dueDate: string,
  settings?: NotificationSettings,
): Promise<string[]> {
  if (!settings || !settings.enabled || settings.minutesBefore === null) {
    return [];
  }

  const notificationIds: string[] = [];
  const dueDateObj = new Date(dueDate);
  const initialNotificationTime = new Date(
    dueDateObj.getTime() - settings.minutesBefore * 60 * 1000,
  );

  // Don't schedule if the notification time is in the past
  if (initialNotificationTime.getTime() <= Date.now()) {
    return [];
  }

  // Schedule initial notification
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "To-Do Reminder",
        body: `${title} is due in ${settings.minutesBefore} minutes`,
        data: { type: "todo", title, isInitial: true },
      },
      trigger: {
        type: "date",
        date: initialNotificationTime,
      },
    });
    notificationIds.push(id);
  } catch (error) {
    console.error("Failed to schedule initial to-do notification:", error);
  }

  // Schedule repeated notifications if enabled
  if (settings.repeatEnabled && settings.repeatEveryMinutes !== null) {
    let currentNotificationTime = new Date(initialNotificationTime.getTime());

    // Keep scheduling repetitions until we reach the due time
    while (true) {
      currentNotificationTime = new Date(
        currentNotificationTime.getTime() +
          settings.repeatEveryMinutes * 60 * 1000,
      );

      // Stop if we've gone past the due time
      if (currentNotificationTime.getTime() >= dueDateObj.getTime()) {
        break;
      }

      if (currentNotificationTime.getTime() > Date.now()) {
        try {
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: "To-Do Reminder",
              body: `Reminder: ${title}`,
              data: { type: "todo", title, isRepetition: true },
            },
            trigger: {
              type: "date",
              date: currentNotificationTime,
            },
          });
          notificationIds.push(id);
        } catch (error) {
          console.error(
            "Failed to schedule repeated to-do notification:",
            error,
          );
        }
      }
    }
  }

  // Schedule final "due now" notification
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "To-Do Due",
        body: `${title} is due now!`,
        data: { type: "todo", title, isDueNow: true },
      },
      trigger: {
        type: "date",
        date: dueDateObj,
      },
    });
    notificationIds.push(id);
  } catch (error) {
    console.error("Failed to schedule due-now notification:", error);
  }

  return notificationIds;
}

export async function scheduleNotificationsForReminder(
  title: string,
  createdAt: string,
  settings?: NotificationSettings,
): Promise<string[]> {
  if (!settings || !settings.enabled || settings.minutesAfter === null) {
    return [];
  }

  const notificationIds: string[] = [];
  const createdAtObj = new Date(createdAt);
  const initialNotificationTime = new Date(
    createdAtObj.getTime() + settings.minutesAfter * 60 * 1000,
  );

  // Don't schedule if the notification time is in the past
  if (initialNotificationTime.getTime() <= Date.now()) {
    return [];
  }

  // Schedule initial notification
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: title,
        data: { type: "reminder", title, isInitial: true },
      },
      trigger: {
        type: "date",
        date: initialNotificationTime,
      },
    });
    notificationIds.push(id);
  } catch (error) {
    console.error("Failed to schedule initial reminder notification:", error);
  }

  // Schedule repeated notifications if enabled
  if (settings.repeatEnabled && settings.repeatEveryMinutes !== null) {
    let currentNotificationTime = new Date(initialNotificationTime.getTime());

    // For reminders, we schedule up to 24 hours total (from creation time)
    const maxNotificationTime = new Date(
      createdAtObj.getTime() + 24 * 60 * 60 * 1000,
    );

    while (true) {
      currentNotificationTime = new Date(
        currentNotificationTime.getTime() +
          settings.repeatEveryMinutes * 60 * 1000,
      );

      // Stop if we've gone past 24 hours from creation
      if (currentNotificationTime.getTime() >= maxNotificationTime.getTime()) {
        break;
      }

      if (currentNotificationTime.getTime() > Date.now()) {
        try {
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: "Reminder",
              body: title,
              data: { type: "reminder", title, isRepetition: true },
            },
            trigger: {
              type: "date",
              date: currentNotificationTime,
            },
          });
          notificationIds.push(id);
        } catch (error) {
          console.error(
            "Failed to schedule repeated reminder notification:",
            error,
          );
        }
      }
    }
  }

  return notificationIds;
}

export async function cancelNotifications(ids: string[]) {
  try {
    await Promise.all(
      ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
    );
  } catch (error) {
    console.error("Failed to cancel notifications:", error);
  }
}
