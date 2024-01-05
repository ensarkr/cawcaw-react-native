import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomList from "../../components/CustomList";
import WhiteText from "../../components/WhiteText";
import { getExplorePostsRequest } from "../../functions/requests";
import Post from "../../components/Post";
import CreatePost from "../../components/CreatePost";
import useNewUserPosts from "../../hooks/useNewUserPosts";

const Post_MEMO = memo(Post);

export default function HomePage() {
  const safeArea = useSafeAreaInsets();
  const newUserPostsHook = useNewUserPosts();

  return (
    <View style={[{ paddingTop: safeArea.top }, styles.view]}>
      <CustomList
        style={styles.list}
        type="posts"
        fetchFunction={getExplorePostsRequest}
        renderItem={(post) => <Post_MEMO type="post" post={post}></Post_MEMO>}
        firstElement={
          <CreatePost
            userPosts={newUserPostsHook.userPosts}
            addNewUserPost={newUserPostsHook.addNewUserPost}
          ></CreatePost>
        }
        onRefresh={newUserPostsHook.clearUserPosts}
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
  view: { flex: 1, backgroundColor: "black" },
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
