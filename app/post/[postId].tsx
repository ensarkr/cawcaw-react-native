import { Link, router, useLocalSearchParams } from "expo-router";
import { Button, Text, View, StyleSheet, ToastAndroid } from "react-native";
import useAuth from "../../context/useAuth";
import Post from "../../components/Post";
import { memo, useEffect, useState } from "react";
import { getPostCommentsRequest, getPostRequest } from "../../functions/requests";
import { post, postComment } from "../../typings/database";
import CustomList from "../../components/CustomList";
import WhiteText from "../../components/WhiteText";
import useNewUserComments from "../../hooks/useNewUserComments";
import Comment from "../../components/Comment";

const Comment_Memo = memo(Comment);

export default function PostPage() {
  const { postId } = useLocalSearchParams();
  const [postData, setPostData] = useState<post | null>(null);
  const auth = useAuth();
  const newUserCommentsHook = useNewUserComments(parseInt(postId as string));

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
  }, [auth.user.status]);

  return (
    <View style={styles.view}>
      <CustomList
        style={[styles.list]}
        type="comments"
        firstElement={
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
        fetchFunction={(page, endPage) =>
          getPostCommentsRequest(parseInt(postId as string), page, endPage)
        }
        renderItem={(comment) => (
          <Comment_Memo comment={comment}></Comment_Memo>
        )}
        onRefresh={() => {
          getAndSetPostData();
          newUserCommentsHook.clearUserComments();
        }}
        lastElement={
          <View style={styles.lastElement}>
            <WhiteText>You have reached to the end.</WhiteText>
          </View>
        }
        noItemError=" "
      ></CustomList>
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
    backgroundColor: "black",
    paddingTop: 0,
    paddingBottom: 15,
  },
  lastElement: {
    paddingTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
