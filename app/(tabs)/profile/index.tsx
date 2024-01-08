import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuth from "../../../context/useAuth";
import WhiteText from "../../../components/WhiteText";
import UserPageComponent from "../../../components/UserPageComponent";
import LoadingView from "../../../components/LoadingView";

export default function ProfilePage() {
  const auth = useAuth();
  const safeArea = useSafeAreaInsets();

  if (auth.user.status === "loading") return <LoadingView></LoadingView>;

  if (auth.user.status === "user") {
    return (
      <UserPageComponent type="user" userId={auth.user.id}></UserPageComponent>
    );
  }

  if (auth.user.status === "guest") {
    return (
      <View style={[{ paddingTop: safeArea.top }, styles.view]}>
        <WhiteText>Sign in to see your profile.</WhiteText>
        <View style={styles.buttonsView}>
          <Link href={"/auth/signIn"} style={styles.button}>
            <WhiteText>SIGN IN</WhiteText>
          </Link>
          <Link href={"/auth/signUp"} style={styles.button}>
            <WhiteText>SIGN UP</WhiteText>
          </Link>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
    backgroundColor: "black",
  },
  buttonsView: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    backgroundColor: "black",
  },
  button: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    width: 120,
    textAlign: "center",
    padding: 5,
  },
});
