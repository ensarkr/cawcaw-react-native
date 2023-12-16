import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Explore() {
  const safeArea = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: safeArea.top }}>
      <Text>EXPLORE</Text>
    </View>
  );
}
