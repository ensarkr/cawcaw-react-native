import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomList from "../../components/CustomList";
import WhiteText from "../../components/WhiteText";
import { explorePostsRequest } from "../../functions/requests";
import Post from "../../components/Post";

export default function Home() {
  const safeArea = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: safeArea.top, flex: 1 }}>
      <CustomList
        style={styles.list}
        type="posts"
        fetchFunction={explorePostsRequest}
        renderItem={(post) => <Post type="post" post={post}></Post>}
        lastElement={
          <View style={styles.lastElement}>
            <WhiteText>You have reached to the end.</WhiteText>
          </View>
        }
      ></CustomList>
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
});
