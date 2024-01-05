import { Pressable, StyleSheet, ToastAndroid, View } from "react-native";
import { user } from "../typings/database";
import { router } from "expo-router";
import WhiteText from "./WhiteText";
import useAuth from "../context/useAuth";
import { useState } from "react";
import {
  followOrUnfollowUserRequest,
  likeOrUnlikePostRequest,
} from "../functions/requests";

export default function User({
  user,
  doBeforeNavigation,
  doAfterAction,
}: {
  user: user;
  doBeforeNavigation?: () => void;
  doAfterAction?: () => void;
}) {
  return (
    <Pressable
      style={styles.view}
      onPress={() => {
        if (doBeforeNavigation !== undefined) doBeforeNavigation();
        router.push("/user/" + user.id);
      }}
    >
      <View style={styles.userView}>
        <View>
          <WhiteText>{user.displayName}</WhiteText>
          <WhiteText style={styles.fade}>@{user.username}</WhiteText>
        </View>
        <FollowButton
          userId={user.id}
          requestedFollows={user.requestedFollows}
          doAfterAction={doAfterAction}
        ></FollowButton>
      </View>
    </Pressable>
  );
}

function FollowButton({
  userId,
  requestedFollows,
  doAfterAction,
}: {
  userId: number;
  requestedFollows: boolean;
  doAfterAction?: () => void;
}) {
  const [follows, setFollows] = useState<boolean>(requestedFollows);
  const auth = useAuth();

  const handleLike = async () => {
    if (auth.user === null) {
      if (follows) setFollows(false);
      ToastAndroid.show(
        "You have to sign in to " + (follows ? "unfollow" : "follow") + ".",
        200
      );
      return;
    }

    setFollows((pv) => !pv);
    const res = await followOrUnfollowUserRequest(
      userId,
      follows ? "unfollow" : "follow"
    );

    if (!res.status) {
      if (!res.message.includes("Already")) setFollows((pv) => !pv);
      ToastAndroid.show(res.message, 200);
    }

    if (doAfterAction) doAfterAction();
  };

  return (
    <>
      <Pressable onPress={handleLike} style={styles.followButton}>
        <WhiteText>{follows ? "FOLLOWING" : "FOLLOW"}</WhiteText>
      </Pressable>
    </>
  );
}

export { FollowButton };

const styles = StyleSheet.create({
  view: {
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
    alignItems: "center",
  },
  justify: {
    textAlign: "justify",
  },
  fade: {
    opacity: 0.8,
  },
  followButton: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 5,
    borderRadius: 5,
  },
});
