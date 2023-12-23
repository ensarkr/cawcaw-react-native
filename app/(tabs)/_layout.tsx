import { Slot, Stack } from "expo-router";
import { Tabs } from "expo-router/tabs";
import { View } from "react-native";
export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: "black" }}></View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ href: "/", title: "home" }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="following/index"
        options={{ href: "/following", title: "following" }}
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
