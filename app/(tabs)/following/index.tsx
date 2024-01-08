import React, { memo, useEffect } from "react";
import { View, StyleSheet, Pressable, VirtualizedList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { post } from "../../../typings/database";
import { getFollowingPostsRequest } from "../../../functions/requests";
import Post from "../../../components/Post";
import WhiteText from "../../../components/WhiteText";
import useAuth from "../../../context/useAuth";
import { Link } from "expo-router";
import LoadingView from "../../../components/LoadingView";
import useCustomList from "../../../hooks/useCustomList";

const Post_MEMO = memo(Post);

export default function FollowingPage() {
  const safeArea = useSafeAreaInsets();
  const auth = useAuth();

  return (
    <View style={[{ paddingTop: safeArea.top }, styles.view]}>
      {auth.user.status === "loading" ? (
        <LoadingView></LoadingView>
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
        <FollowingList></FollowingList>
      )}
    </View>
  );
}

function FollowingList() {
  const followingList = useCustomList({
    type: "posts",
    fetchFunction: getFollowingPostsRequest,
    renderItem: (post: post) => <Post_MEMO type="post" post={post}></Post_MEMO>,
  });

  const auth = useAuth();

  useEffect(() => {
    if (auth.user.status !== "loading") followingList.startFetching();
  }, [auth.user]);

  return <VirtualizedList {...followingList.listProps}></VirtualizedList>;
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
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
