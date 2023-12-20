import { Link, router } from "expo-router";
import { post } from "../typings/database";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  ToastAndroid,
  Button,
} from "react-native";
import { useState } from "react";
import useAuth from "../context/useAuth";
import { addCommentRequest } from "../functions/requests";
import WhiteText from "./WhiteText";
import CustomTextInput from "./CustomTextInput";
import useCustomTextInput from "../hooks/useCustomTextInput";

export default function AddComment({
  postId,
  addNewUserComment,
}: {
  postId: number;
  addNewUserComment: (
    displayName: string,
    username: string,
    userId: number,
    comment: string
  ) => void;
}) {
  const auth = useAuth();
  const comment = useCustomTextInput({
    uiName: "comment",
    placeholder: "Click to write your comment",
    limit: 150,
  });

  const handleSubmit = async () => {
    if (auth.user.status !== "user") {
      ToastAndroid.show("User not signed in", 200);
      return;
    }

    const res = await addCommentRequest(postId, comment.props.value);

    if (res.status) {
      comment.setValue("");
      addNewUserComment(
        auth.user.displayName,
        auth.user.username,
        auth.user.id,
        comment.props.value
      );
    } else {
      ToastAndroid.show(res.message, 200);
      return;
    }
  };

  return (
    <>
      <View style={styles.view}>
        <CustomTextInput {...comment}></CustomTextInput>

        <View style={styles.infoView}>
          <WhiteText style={styles.fade}>
            {comment.props.value.length}/150
          </WhiteText>
          <Pressable
            disabled={comment.props.value.trim().length === 0}
            onPress={handleSubmit}
          >
            <Image
              style={styles.icon}
              source={require("../assets/send-solid-24.png")}
            ></Image>
          </Pressable>
        </View>
      </View>
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
  icon: {
    height: 20,
    width: 30,
    objectFit: "contain",
    alignSelf: "flex-end",
  },
  infoView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 25,
  },
  fade: {
    opacity: 0.8,
  },
});
