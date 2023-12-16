import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Search() {
  const safeArea = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: safeArea.top }}>
      <Text>SEARCH</Text>
    </View>
  );
}
