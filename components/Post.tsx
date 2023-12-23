import { router } from "expo-router";
import { post, postComment } from "../typings/database";
import { View, StyleSheet, Image, Pressable, ToastAndroid } from "react-native";
import { memo, useState } from "react";
import useAuth from "../context/useAuth";
import { likeOrUnlikePostRequest } from "../functions/requests";
import WhiteText from "./WhiteText";
import AddComment from "./AddComment";
import Comment from "./Comment";

const Comment_Memo = memo(Comment);

type postComponentProps =
  | {
      type: "post";
      post: post;
      userComments?: undefined;
      addNewUserComment?: undefined;
    }
  | {
      type: "postWithComments";
      post: post;
      userComments: postComment[];
      addNewUserComment: (
        displayName: string,
        username: string,
        userId: number,
        comment: string
      ) => void;
    };

export default function Post({
  type,
  post,
  userComments,
  addNewUserComment,
}: postComponentProps) {
  // console.log("post rerender" + post.id);
  return (
    <>
      <Pressable
        style={type === "post" ? styles.view : styles.commentView}
        onPress={() => router.push("/post/" + post.id)}
      >
        <View style={styles.userView}>
          <Pressable
            onPress={() => {
              router.push("/user/" + post.userId);
            }}
          >
            <View>
              <WhiteText>{post.displayName}</WhiteText>
              <WhiteText style={styles.fade}>@{post.username}</WhiteText>
            </View>
          </Pressable>
          <WhiteText style={styles.fade}>
            {new Date(post.insertedAt).toISOString().split("T")[0]}
          </WhiteText>
        </View>
        <WhiteText style={styles.justify}>{post.text}</WhiteText>
        {post.imageUrl !== null && (
          <Image
            source={{
              uri: post.imageUrl,
            }}
            style={[styles.image, { aspectRatio: post.aspectRatio }]}
          ></Image>
        )}
        <View style={styles.infoView}>
          <Pressable
            style={styles.iconButton}
            onPress={() => {
              router.push("/post/" + post.id);
            }}
          >
            <Image
              style={styles.icon}
              source={require("../assets/message-square-dots-regular-24.png")}
            ></Image>
            <View>
              <WhiteText>
                {userComments !== undefined
                  ? userComments.length + post.commentsCount
                  : post.commentsCount}
              </WhiteText>
            </View>
          </Pressable>
          <LikeButton
            postId={post.id}
            requestedLiked={post.requestedLiked}
            likeCount={post.likesCount}
          ></LikeButton>
        </View>
      </Pressable>
      {type === "postWithComments" ? (
        <>
          <AddComment
            postId={post.id}
            addNewUserComment={addNewUserComment}
          ></AddComment>
          {userComments.map((e) => (
            <Comment_Memo key={e.id} comment={e}></Comment_Memo>
          ))}
        </>
      ) : (
        <></>
      )}
    </>
  );
}

function LikeButton({
  postId,
  requestedLiked,
  likeCount,
}: {
  postId: number;
  requestedLiked: boolean;
  likeCount: number;
}) {
  const [liked, setLiked] = useState<boolean>(requestedLiked);
  const auth = useAuth();

  const handleLike = async () => {
    if (auth.user === null) {
      if (liked) setLiked(false);
      ToastAndroid.show(
        "You have to sign in to " + (liked ? "unlike" : "like") + ".",
        200
      );
      return;
    }

    setLiked((pv) => !pv);
    const res = await likeOrUnlikePostRequest(
      postId,
      liked ? "unlike" : "like"
    );

    if (!res.status) {
      if (!res.message.includes("Already")) setLiked((pv) => !pv);
      ToastAndroid.show(res.message, 200);
    }
  };

  const getLikeCount = () => {
    if (requestedLiked === false && liked === true) {
      return likeCount + 1;
    }
    if (requestedLiked === true && liked === false) {
      return likeCount - 1;
    }
    return likeCount;
  };

  return (
    <>
      <Pressable onPress={handleLike} style={styles.iconButton}>
        <Image
          style={styles.icon}
          source={
            liked
              ? require("../assets/heart-solid-24.png")
              : require("../assets/heart-regular-24.png")
          }
        ></Image>

        <View>
          <WhiteText style={styles.fade}>{getLikeCount()}</WhiteText>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  commentView: {
    padding: 16,
    borderColor: "gray",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    color: "white",
    gap: 15,
  },
  view: {
    padding: 15,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    color: "white",
    gap: 15,
  },
  userView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    height: 20,
    width: 30,
    objectFit: "contain",
  },
  iconButton: {
    flexDirection: "row",
    width: 70,
  },
  infoView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 25,
  },
  justify: {
    textAlign: "justify",
  },
  fade: {
    opacity: 0.8,
  },
  image: {
    width: "100%",
    resizeMode: "cover",
  },
});
