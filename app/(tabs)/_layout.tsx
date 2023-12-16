import { Slot, Stack } from "expo-router";
import { Tabs } from "expo-router/tabs";
import { View } from "react-native";
export default function TabsLayout() {
  return (
    <Tabs initialRouteName="index" screenOptions={{ headerShown: false ,}}>
      <Tabs.Screen
        name="index"
        options={{ href: "/", title: "home" }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="explore/index"
        options={{ href: "/explore", title: "explore" }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="search/index"
        options={{ href: "/search", title: "search" }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile/index"
        options={{ href: "/profile", title: "profile" }}
      ></Tabs.Screen>
    </Tabs>
  );
}
