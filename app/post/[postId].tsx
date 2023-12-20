import { Link, router, useLocalSearchParams } from "expo-router";
import { Button, Text, View, StyleSheet, ToastAndroid } from "react-native";
import useAuth from "../../context/useAuth";
import Post from "../../components/Post";
import { useEffect, useState } from "react";
import { postCommentsRequest, postRequest } from "../../functions/requests";
import { post, postComment } from "../../typings/database";
import CustomList from "../../components/CustomList";
import WhiteText from "../../components/WhiteText";
import useComment from "../../hooks/useComments";
import Comment from "../../components/Comment";

export default function PostPage() {
  const { postId } = useLocalSearchParams();
  const [postData, setPostData] = useState<post | null>(null);
  const auth = useAuth();
  const comment = useComment(parseInt(postId as string));

  const asyncOperation = async () => {
    const res = await postRequest(parseInt(postId as string));

    if (res.status) {
      setPostData(res.value);
    } else {
      ToastAndroid.show(res.message, 300);
      router.back();
    }
  };

  useEffect(() => {
    asyncOperation();
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
              addNewUserComment={comment.addNewUserComment}
              userComments={comment.userComments}
            ></Post>
          ) : (
            <></>
          )
        }
        fetchFunction={(page, endPage) =>
          postCommentsRequest(parseInt(postId as string), page, endPage)
        }
        renderItem={(comment) => <Comment comment={comment}></Comment>}
        onRefresh={() => {
          asyncOperation();
          comment.clearUserComments();
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
