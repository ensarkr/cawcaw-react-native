import React, { useEffect, useRef, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { post } from "../../../typings/database";
import { explorePostsRequest } from "../../../functions/requests";
import CustomFlatList from "../../../components/CustomFlatList";
import Post from "../../../components/Post";

export default function Explore() {
  const safeArea = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: safeArea.top, flex: 1 }}>
      <Text>EXPLORE</Text>
      <CustomFlatList
        style={{
          padding: 5,
          gap: 10,
          backgroundColor: "black",
          paddingTop: 15,
          paddingBottom: 15,
        }}
        type="posts"
        fetchFunction={explorePostsRequest}
        renderItem={(post: post) => <Post post={post}></Post>}
        lastElement={<Text>You reached to last post.</Text>}
      ></CustomFlatList>
    </View>
  );
}
