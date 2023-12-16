import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const safeArea = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: safeArea.top }}>
      <Text>HOME</Text>
      <Link href={"/post/1"}>POST</Link>
      <Link href={"/user/1"}>USER</Link>
    </View>
  );
}
