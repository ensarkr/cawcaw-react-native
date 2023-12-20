import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Text,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { post } from "../../../typings/database";
import { followingPostsRequest } from "../../../functions/requests";
import CustomList from "../../../components/CustomList";
import Post from "../../../components/Post";
import WhiteText from "../../../components/WhiteText";
import useAuth from "../../../context/useAuth";
import { router } from "expo-router";

export default function Following() {
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
          fetchFunction={followingPostsRequest}
          renderItem={(post: post) => <Post type="post" post={post}></Post>}
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
  list: {
    padding: 5,
    gap: 10,
    backgroundColor: "black",
    paddingTop: 15,
    paddingBottom: 15,
  },
  lastElement: {
    paddingTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  view: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
