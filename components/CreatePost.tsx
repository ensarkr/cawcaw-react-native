import { post } from "../typings/database";
import { View, StyleSheet, Image, Pressable, ToastAndroid } from "react-native";
import { memo, useState } from "react";
import useAuth from "../context/useAuth";
import { createPostRequest } from "../functions/requests";
import WhiteText from "./WhiteText";
import CustomTextInput from "./CustomTextInput";
import useCustomTextInput from "../hooks/useCustomTextInput";
import * as DocumentPicker from "expo-document-picker";
import useNewUserPosts from "../hooks/useNewUserPosts";
import Post from "./Post";

const Post_Memo = memo(Post);

export default function CreatePost({
  userPosts,
  addNewUserPost,
}: {
  userPosts: post[];
  addNewUserPost: ReturnType<typeof useNewUserPosts>["addNewUserPost"];
}) {
  const postText = useCustomTextInput({
    uiName: "post",
    limit: 250,
    placeholder: "Click to write your post.",
  });
  const [image, setImage] = useState<
    (DocumentPicker.DocumentPickerAsset & { aspectRatio: number }) | null
  >(null);
  const [isUploading, setIsUploading] = useState(false);
  const auth = useAuth();
  const isSubmitDisabled =
    isUploading || (image === null && postText.props.value.trim().length === 0);

  const handleSubmit = async () => {
    if (auth.user.status !== "user") {
      ToastAndroid.show("You have to sign in to post.", 200);
      return;
    }
    setIsUploading(true);

    const res = await createPostRequest(postText.props.value, image);

    if (res.status) {
      addNewUserPost(
        auth.user.displayName,
        auth.user.username,
        auth.user.id,
        postText.props.value,
        image,
        res.value.postId
      );
      postText.setValue("");
      setImage(null);
    } else {
      ToastAndroid.show(res.message, 200);
    }
    setIsUploading(false);
  };

  const handleImagePick = async () => {
    if (image !== null) {
      setImage(null);
      return;
    }

    const res = await DocumentPicker.getDocumentAsync({
      type: ["image/webp", "image/png", "image/jpeg"],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (res.canceled) {
      return;
    }

    if (res.assets[0].size !== undefined && res.assets[0].size > 1000000) {
      ToastAndroid.show("Image must be smaller than 1MB.", 200);
      return;
    }

    Image.getSize(res.assets[0].uri, (width, height) => {
      setImage({ ...res.assets[0], aspectRatio: width / height });
    });
  };

  return (
    <>
      <View style={[styles.view, isUploading ? { opacity: 0.5 } : {}]}>
        <CustomTextInput {...postText}></CustomTextInput>
        {image !== null && (
          <Image
            source={{
              uri: image.uri,
            }}
            style={[styles.image, { aspectRatio: image.aspectRatio }]}
          ></Image>
        )}

        <View style={styles.infoView}>
          <Pressable style={styles.picButton} onPress={handleImagePick}>
            <Image
              style={styles.icon}
              source={
                image === null
                  ? require("../assets/image-add-regular-24.png")
                  : require("../assets/trash-alt-regular-24.png")
              }
            ></Image>
          </Pressable>
          <View style={styles.rightInfo}>
            <WhiteText>{postText.props.value.length}/250</WhiteText>
            <Pressable
              disabled={isSubmitDisabled}
              onPress={handleSubmit}
              style={styles.iconButton}
            >
              <Image
                style={[styles.icon, isSubmitDisabled ? { opacity: 0.5 } : {}]}
                source={require("../assets/send-solid-24.png")}
              ></Image>
            </Pressable>
          </View>
        </View>
      </View>
      {userPosts.map((e) => (
        <Post_Memo key={e.id} type="post" post={e}></Post_Memo>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    padding: 15,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    color: "white",
    flex: 1,
    gap: 15,
  },
  icon: {
    height: 20,
    width: 30,
    objectFit: "contain",
  },
  picButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    flexDirection: "row",
    width: 70,
  },
  infoView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rightInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 155,
  },
  image: {
    width: "100%",
    resizeMode: "cover",
  },
});
