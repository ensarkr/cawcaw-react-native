import { Tabs } from "expo-router/tabs";
import { Image, StyleSheet, View } from "react-native";
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
        options={{
          href: "/",
          title: "HOME",
          tabBarHideOnKeyboard: true,
          tabBarIcon: () => (
            <Image
              style={styles.icon}
              source={require("../../assets/home-alt-2-regular-36.png")}
            ></Image>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="following/index"
        options={{
          href: "/following",
          title: "FOLLOWING",
          tabBarIcon: () => (
            <Image
              style={styles.icon}
              source={require("../../assets/user-pin-regular-36.png")}
            ></Image>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="search/index"
        options={{
          href: "/search",
          title: "SEARCH",
          tabBarHideOnKeyboard: true,
          tabBarIcon: () => (
            <Image
              style={styles.icon}
              source={require("../../assets/search-regular-36.png")}
            ></Image>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile/index"
        options={{
          href: "/profile",
          title: "PROFILE",
          tabBarIcon: () => (
            <Image
              style={styles.icon}
              source={require("../../assets/user-regular-36.png")}
            ></Image>
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 28,
    height: 28,
  },
});
