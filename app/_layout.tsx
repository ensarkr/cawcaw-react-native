import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../context/useAuth";

export default function StackLayout() {
  return (
    <AuthProvider>
      <Stack
        initialRouteName="(tabs)"
        screenOptions={{ animation: "fade_from_bottom" }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
    </AuthProvider>
  );
}
