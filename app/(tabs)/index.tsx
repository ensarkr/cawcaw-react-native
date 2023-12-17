import { Link } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

export default function Home() {
  const safeArea = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: safeArea.top }}>
      <Text>HOME</Text>
      <Link href={"/post/1"}>POST</Link>
      <Link href={"/user/1"}>USER</Link>
      <Button
        title="set"
        onPress={() => {
          SecureStore.setItemAsync("test", "");
        }}
      ></Button>
      <Button
        title="get"
        onPress={() => {
          SecureStore.getItemAsync("qwe").then((e) => console.log(e));
        }}
      ></Button>
    </View>
  );
}
