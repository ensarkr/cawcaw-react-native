import { router, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, ToastAndroid, VirtualizedList } from "react-native";
import useAuth from "../../context/useAuth";
import Post from "../../components/Post";
import { memo, useEffect, useState } from "react";
import {
  getPostCommentsRequest,
  getPostRequest,
} from "../../functions/requests";
import { post } from "../../typings/database";
import useNewUserComments from "../../hooks/useNewUserComments";
import Comment from "../../components/Comment";
import useCustomList from "../../hooks/useCustomList";

const Comment_Memo = memo(Comment);

export default function PostPage() {
  const { postId } = useLocalSearchParams();
  const [postData, setPostData] = useState<post | null>(null);
  const auth = useAuth();
  const newUserCommentsHook = useNewUserComments(parseInt(postId as string));
  const postCommentsList = useCustomList({
    type: "comments",
    renderItem: (comment) => <Comment_Memo comment={comment}></Comment_Memo>,
    fetchFunction: (page, endPage) =>
      getPostCommentsRequest(parseInt(postId as string), page, endPage),
    onRefresh: () => {
      getAndSetPostData();
      newUserCommentsHook.clearUserComments();
    },
  });

  const getAndSetPostData = async () => {
    const res = await getPostRequest(parseInt(postId as string));

    if (res.status) {
      setPostData(res.value);
    } else {
      ToastAndroid.show(res.message, 300);
      router.back();
    }
  };

  useEffect(() => {
    getAndSetPostData();
    postCommentsList.startFetching();
  }, [auth.user.status]);

  return (
    <View style={styles.view}>
      <VirtualizedList
        {...postCommentsList.listProps}
        ListHeaderComponent={
          postData !== null ? (
            <Post
              type="postWithComments"
              post={postData}
              addNewUserComment={newUserCommentsHook.addNewUserComment}
              userComments={newUserCommentsHook.userComments}
            ></Post>
          ) : (
            <></>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});
