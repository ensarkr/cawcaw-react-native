import { Link, router } from "expo-router";
import { post } from "../typings/database";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  ToastAndroid,
} from "react-native";
import { useState } from "react";
import useAuth from "../context/useAuth";
import { likeOrUnlikePostRequest } from "../functions/requests";
import WhiteText from "./WhiteText";

export default function Post({ post }: { post: post }) {
  return (
    <>
      <Pressable onPress={() => router.push("/post/" + post.id)}>
        <View style={styles.view}>
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
              {post.insertedAt.toString().split("T")[0]}
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
                <WhiteText>{post.commentsCount}</WhiteText>
              </View>
            </Pressable>
            <LikeButton
              postId={post.id}
              requestedLiked={post.requestedLiked}
              likeCount={post.likesCount}
            ></LikeButton>
          </View>
        </View>
      </Pressable>
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
      setLiked((pv) => !pv);
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
  view: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    color: "while",
    gap: 15,
  },
  userView: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
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
