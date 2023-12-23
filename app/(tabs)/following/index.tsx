import React, { memo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { post } from "../../../typings/database";
import { getFollowingPostsRequest } from "../../../functions/requests";
import CustomList from "../../../components/CustomList";
import Post from "../../../components/Post";
import WhiteText from "../../../components/WhiteText";
import useAuth from "../../../context/useAuth";
import { router } from "expo-router";

const Post_MEMO = memo(Post);

export default function FollowingPage() {
  const safeArea = useSafeAreaInsets();
  const auth = useAuth();

  return (
    <View style={[{ paddingTop: safeArea.top }, styles.view]}>
      {auth.user.status === "loading" ? (
        <></>
      ) : auth.user.status === "guest" ? (
        <>
          <WhiteText>Sign in to see posts by users that you follow.</WhiteText>
          <Pressable onPress={() => router.push("/auth/signIn")}>
            <WhiteText>Sign In</WhiteText>
          </Pressable>
          <Pressable onPress={() => router.push("/auth/signUp")}>
            <WhiteText>Sign Up</WhiteText>
          </Pressable>
        </>
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
});
