import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../context/useAuth";
import { StyleSheet, View } from "react-native";

export default function StackLayout() {
  return (
    <View style={styles.mainView}>
      <AuthProvider>
        <Stack
          initialRouteName="(tabs)"
          screenOptions={{
            animation: "fade_from_bottom",
            statusBarColor: "black",
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="post/[postId]"
            options={{
              title: "POST",
              headerStyle: { backgroundColor: "black" },
              headerTitleStyle: { color: "white" },
              headerTintColor: "white",
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="user/[userId]"
            options={{
              title: "USER",
              headerStyle: { backgroundColor: "black" },
              headerTitleStyle: { color: "white" },
              headerTintColor: "white",
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="auth/signIn/index"
            options={{
              title: "SIGN IN",
              headerStyle: { backgroundColor: "black" },
              headerTitleStyle: { color: "white" },
              headerTintColor: "white",
            }}
          ></Stack.Screen>
          <Stack.Screen
            name="auth/signUp/index"
            options={{
              title: "SIGN UP",
              headerStyle: { backgroundColor: "black" },
              headerTitleStyle: { color: "white" },
              headerTintColor: "white",
            }}
          ></Stack.Screen>
        </Stack>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "black",
  },
});
