import React, { memo, useEffect } from "react";
import { View, StyleSheet, VirtualizedList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getExplorePostsRequest } from "../../functions/requests";
import Post from "../../components/Post";
import CreatePost from "../../components/CreatePost";
import useNewUserPosts from "../../hooks/useNewUserPosts";
import useCustomList from "../../hooks/useCustomList";
import useAuth from "../../context/useAuth";
import LoadingView from "../../components/LoadingView";

const Post_MEMO = memo(Post);

export default function HomePage() {
  const safeArea = useSafeAreaInsets();
  const newUserPostsHook = useNewUserPosts();
  const exploreList = useCustomList({
    type: "posts",
    fetchFunction: getExplorePostsRequest,
    renderItem: (post) => <Post_MEMO type="post" post={post}></Post_MEMO>,
    onRefresh: newUserPostsHook.clearUserPosts,
    refetchWhenAuthChanges: true,
  });
  const auth = useAuth();

  useEffect(() => {
    if (auth.user.status !== "loading") exploreList.startFetching();
  }, [auth.user]);

  return (
    <View style={[{ paddingTop: safeArea.top }, styles.view]}>
      {auth.user.status === "loading" ? (
        <LoadingView></LoadingView>
      ) : (
        <VirtualizedList
          {...exploreList.listProps}
          ListHeaderComponent={
            exploreList.refreshing && exploreList.items.length === 0 ? (
              <></>
            ) : (
              <CreatePost
                userPosts={newUserPostsHook.userPosts}
                addNewUserPost={newUserPostsHook.addNewUserPost}
              ></CreatePost>
            )
          }
        ></VirtualizedList>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: "black" },
});
