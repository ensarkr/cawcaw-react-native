import { Link } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuth from "../../../context/useAuth";

export default function Profile() {
  const safeArea = useSafeAreaInsets();

  const auth = useAuth();

  return (
    <View style={{ paddingTop: safeArea.top }}>
      <Text>PROFILE</Text>
      <Link href={"/auth/signIn"}>sign in</Link>
      <Link href={"/auth/signUp"}>sign up</Link>

      {auth.user.status === "user" ? (
        <>
          <Text>id: {auth.user.id}</Text>
          <Text>display name: {auth.user.displayName}</Text>
          <Text>username: {auth.user.username}</Text>
          <Button title="sign out" onPress={auth.signOut}></Button>
        </>
      ) : (
        <Text>User not signed in.</Text>
      )}
    </View>
  );
}
