import React, { useEffect, useRef, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { post } from "../../../typings/database";
import { explorePostsRequest } from "../../../functions/requests";
import CustomFlatList from "../../../components/CustomFlatList";

export default function Explore() {
  const safeArea = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: safeArea.top, flex: 1 }}>
      <Text>EXPLORE</Text>
      <CustomFlatList
        type="posts"
        fetchFunction={explorePostsRequest}
        renderItem={(post: post) => (
          <Text>{JSON.stringify(post, null, 4)}</Text>
        )}
        lastElement={<Text>You reached to last post.</Text>}
      ></CustomFlatList>
    </View>
  );
}
