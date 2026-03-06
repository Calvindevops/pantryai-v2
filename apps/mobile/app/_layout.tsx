import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="recipe/[id]"
          options={{ headerShown: true, title: "Recipe" }}
        />
        <Stack.Screen
          name="cook/[id]"
          options={{ headerShown: true, title: "Cook Mode" }}
        />
        <Stack.Screen
          name="challenge/[code]"
          options={{ headerShown: true, title: "Fridge Challenge" }}
        />
      </Stack>
    </>
  );
}
