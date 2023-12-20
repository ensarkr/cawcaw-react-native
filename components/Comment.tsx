import { router } from "expo-router";
import { postComment } from "../typings/database";
import { View, StyleSheet, Pressable } from "react-native";
import WhiteText from "./WhiteText";

export default function Comment({ comment }: { comment: postComment }) {
  return (
    <>
      <Pressable
        style={styles.view}
        onPress={() => router.push("/post/" + comment.postId)}
      >
        <View style={styles.userView}>
          <Pressable
            onPress={() => {
              router.push("/user/" + comment.userId);
            }}
          >
            <View>
              <WhiteText>{comment.displayName}</WhiteText>
              <WhiteText style={styles.fade}>@{comment.username}</WhiteText>
            </View>
          </Pressable>
          <WhiteText style={styles.fade}>
            {new Date(comment.insertedAt).toISOString().split("T")[0]}
          </WhiteText>
        </View>
        <WhiteText style={styles.justify}>{comment.comment}</WhiteText>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    marginTop: 15,
    padding: 16,
    borderColor: "gray",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    color: "white",
    gap: 15,
  },
  userView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  justify: {
    textAlign: "justify",
  },
  fade: {
    opacity: 0.8,
  },
});
