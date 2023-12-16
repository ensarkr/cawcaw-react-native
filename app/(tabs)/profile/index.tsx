import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const safeArea = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: safeArea.top }}>
      <Text>PROFILE</Text>
      <Link href={"/auth/signIn"}>sign in</Link>
      <Link href={"/auth/signUp"}>sign up</Link>
    </View>
  );
}
