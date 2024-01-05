import React, { memo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { post } from "../../../typings/database";
import { getFollowingPostsRequest } from "../../../functions/requests";
import CustomList from "../../../components/CustomList";
import Post from "../../../components/Post";
import WhiteText from "../../../components/WhiteText";
import useAuth from "../../../context/useAuth";
import { Link, router } from "expo-router";

const Post_MEMO = memo(Post);

export default function FollowingPage() {
  const safeArea = useSafeAreaInsets();
  const auth = useAuth();

  return (
    <View style={[{ paddingTop: safeArea.top }, styles.view]}>
      {auth.user.status === "loading" ? (
        <></>
      ) : auth.user.status === "guest" ? (
        <View style={styles.centeredView}>
          <WhiteText>Sign in to see posts by users that you follow.</WhiteText>
          <View style={styles.buttonsView}>
            <Link href={"/auth/signIn"} style={styles.button}>
              <WhiteText>SIGN IN</WhiteText>
            </Link>
            <Link href={"/auth/signUp"} style={styles.button}>
              <WhiteText>SIGN UP</WhiteText>
            </Link>
          </View>
        </View>
      ) : (
        <CustomList
          style={styles.list}
          type="posts"
          fetchFunction={getFollowingPostsRequest}
          renderItem={(post: post) => (
            <Post_MEMO type="post" post={post}></Post_MEMO>
          )}
          refetchWhenAuthChanges={false}
          lastElement={
            <View style={styles.lastElement}>
              <WhiteText>You have reached to the end.</WhiteText>
            </View>
          }
        ></CustomList>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  list: {
    padding: 5,
    gap: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "black",
  },
  lastElement: {
    paddingTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
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
