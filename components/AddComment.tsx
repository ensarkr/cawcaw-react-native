import { View, StyleSheet, Image, Pressable, ToastAndroid } from "react-native";
import useAuth from "../context/useAuth";
import { addCommentRequest } from "../functions/requests";
import WhiteText from "./WhiteText";
import CustomTextInput from "./CustomTextInput";
import useCustomTextInput from "../hooks/useCustomTextInput";
import { useState } from "react";

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
  const [isUploading, setIsUploading] = useState(false);

  const isSubmitDisabled =
    isUploading || comment.props.value.trim().length === 0;

  const handleSubmit = async () => {
    if (auth.user.status !== "user") {
      ToastAndroid.show("You have to sign in to comment.", 200);
      return;
    }
    setIsUploading(true);

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
    }

    setIsUploading(false);
  };

  return (
    <>
      <View style={[styles.view, isUploading ? { opacity: 0.5 } : {}]}>
        <CustomTextInput {...comment}></CustomTextInput>

        <View style={styles.infoView}>
          <WhiteText style={styles.fade}>
            {comment.props.value.length}/150
          </WhiteText>
          <Pressable disabled={isSubmitDisabled} onPress={handleSubmit}>
            <Image
              style={[styles.icon, isSubmitDisabled ? { opacity: 0.5 } : {}]}
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
    marginRight: 40,
  },
  infoView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-end",
    width: 160,
  },
  fade: {
    opacity: 0.8,
  },
});
