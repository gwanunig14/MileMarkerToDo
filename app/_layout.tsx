import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { TodoStoreProvider } from "@/lib/todo-store";

export const unstable_settings = {
  anchor: "login",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = {
    ...(colorScheme === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: "transparent",
    },
  };

  return (
    <ThemeProvider value={theme}>
      <TodoStoreProvider>
        <Stack
          screenOptions={{
            animation: "fade",
            gestureEnabled: false,
            contentStyle: {
              backgroundColor: "transparent",
            },
          }}
        >
          <Stack.Screen
            name="login"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="todo"
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </Stack>
      </TodoStoreProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
