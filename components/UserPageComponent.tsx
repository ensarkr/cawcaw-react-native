import { Link, useFocusEffect } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  ToastAndroid,
  View,
  Image,
  VirtualizedList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import useAuth from "../context/useAuth";
import {
  getPublicUserRequest,
  getUserPostsRequest,
  getUserComments,
  getUserLikesRequest,
  getUserFollowersRequest,
  getUserFollowingsRequest,
} from "../functions/requests";
import { post, user, postComment } from "../typings/database";
import Post from "./Post";
import Comment from "./Comment";
import User, { FollowButton } from "./User";
import WhiteText from "./WhiteText";
import LoadingView from "./LoadingView";
import useCustomList from "../hooks/useCustomList";

const Post_MEMO = memo(Post);
const Comment_MEMO = memo(Comment);
const User_MEMO = memo(User);

type tabs = "posts" | "comments" | "likes";

export default function UserPageComponent({
  type,
  userId,
}: {
  type: "user" | "guest";
  userId: number;
}) {
  const safeArea = useSafeAreaInsets();
  const [userData, setUserData] = useState<user | null>(null);

  const auth = useAuth();

  const getSetUserData = async (userId: number) => {
    const res = await getPublicUserRequest(userId);

    if (!res.status) {
      router.back();
      ToastAndroid.show(res.message, 200);
      if (type === "user") auth.signOut();
      return;
    }

    setUserData(res.value);
  };

  useFocusEffect(
    useCallback(() => {
      getSetUserData(userId);
    }, [auth.user.status])
  );

  return (
    <View style={[{ paddingTop: safeArea.top }, styles.view]}>
      {userData === null ? (
        <LoadingView></LoadingView>
      ) : (
        <>
          <View style={styles.topView}>
            <View style={styles.leftPart}>
              <View>
                <WhiteText>{userData.displayName}</WhiteText>
                <WhiteText style={styles.fade}>@{userData.username}</WhiteText>
              </View>
              <FollowPart
                userData={userData}
                doAfterAction={() => {
                  if (type === "user") getSetUserData(userId);
                }}
              ></FollowPart>
            </View>
            <View style={styles.buttonsView}>
              {type === "guest" ? (
                <FollowButton
                  requestedFollows={userData.requestedFollows}
                  userId={userData.id}
                  doAfterAction={() => getSetUserData(userData.id)}
                ></FollowButton>
              ) : (
                <Pressable onPress={auth.signOut} style={styles.button}>
                  <WhiteText>SIGN OUT</WhiteText>
                </Pressable>
              )}
            </View>
          </View>
          <UserTabs userId={userId}></UserTabs>
        </>
      )}
    </View>
  );
}

function UserTabs({ userId }: { userId: number }) {
  const [tab, setTab] = useState<tabs>("posts");
  const postsList = useCustomList({
    type: "posts",
    fetchFunction: (page: number, endPage: Date) =>
      getUserPostsRequest(page, endPage, userId),
    renderItem: (post: post) => <Post_MEMO type="post" post={post}></Post_MEMO>,
  });
  const commentsList = useCustomList({
    type: "comments",
    fetchFunction: (page: number, endPage: Date) =>
      getUserComments(page, endPage, userId),
    renderItem: (comment: postComment) => (
      <Comment_MEMO comment={comment}></Comment_MEMO>
    ),
  });
  const likesList = useCustomList({
    type: "posts",
    fetchFunction: (page: number, endPage: Date) =>
      getUserLikesRequest(page, endPage, userId),
    renderItem: (post: post) => <Post_MEMO type="post" post={post}></Post_MEMO>,
  });

  useEffect(() => {
    postsList.startFetching();
  }, []);

  const changeTab = (tab: tabs) => {
    switch (tab) {
      case "posts": {
        setTab("posts");
        return;
      }
      case "comments": {
        if (!commentsList.didItStart) commentsList.startFetching();
        setTab("comments");
        return;
      }
      case "likes": {
        if (!likesList.didItStart) likesList.startFetching();
        setTab("likes");
        return;
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => changeTab("posts")}
          style={[styles.tabButton, tab === "posts" ? styles.activeTab : {}]}
        >
          <WhiteText>POSTS</WhiteText>
        </Pressable>
        <Pressable
          onPress={() => changeTab("comments")}
          style={[styles.tabButton, tab === "comments" ? styles.activeTab : {}]}
        >
          <WhiteText>COMMENTS</WhiteText>
        </Pressable>
        <Pressable
          onPress={() => changeTab("likes")}
          style={[styles.tabButton, tab === "likes" ? styles.activeTab : {}]}
        >
          <WhiteText>LIKES</WhiteText>
        </Pressable>
      </View>

      <View style={tab === "posts" ? { flex: 1 } : { height: 0 }}>
        <VirtualizedList {...postsList.listProps}></VirtualizedList>
      </View>
      <View style={tab === "comments" ? { flex: 1 } : { height: 0 }}>
        <VirtualizedList {...commentsList.listProps}></VirtualizedList>
      </View>
      <View style={tab === "likes" ? { flex: 1 } : { height: 0 }}>
        <VirtualizedList {...likesList.listProps}></VirtualizedList>
      </View>
    </View>
  );
}

function FollowPart({
  userData,
  doAfterAction,
}: {
  userData: user;
  doAfterAction: () => void;
}) {
  type modals = "none" | "following" | "followers";
  const [followModal, setFollowModal] = useState<modals>("none");

  const followersList = useCustomList({
    type: "users",
    fetchFunction: (page: number, endPage: Date) =>
      getUserFollowersRequest(page, endPage, userData.id),
    renderItem: (user: user) => (
      <User_MEMO
        user={user}
        doBeforeNavigation={() => setFollowModal("none")}
        doAfterAction={doAfterAction}
      ></User_MEMO>
    ),
  });
  const followingList = useCustomList({
    type: "users",
    fetchFunction: (page: number, endPage: Date) =>
      getUserFollowingsRequest(page, endPage, userData.id),
    renderItem: (user: user) => (
      <User_MEMO
        user={user}
        doBeforeNavigation={() => setFollowModal("none")}
        doAfterAction={doAfterAction}
      ></User_MEMO>
    ),
  });

  return (
    <View style={styles.countsView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={followModal !== "none"}
        onRequestClose={() => {
          setFollowModal("none");
        }}
      >
        <View style={styles.modal}>
          <Pressable
            style={styles.closeView}
            onPress={() => {
              setFollowModal("none");
            }}
          ></Pressable>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <WhiteText style={styles.title}>
                {followModal === "followers"
                  ? userData.followersCount
                  : userData.followingCount}{" "}
                {followModal.toUpperCase()}
              </WhiteText>
              <Pressable
                onPress={() => {
                  setFollowModal("none");
                }}
              >
                <Image
                  style={styles.icon}
                  source={require("../assets/x-regular-36.png")}
                ></Image>
              </Pressable>
            </View>
            <View
              style={followModal === "followers" ? { flex: 1 } : { height: 0 }}
            >
              <VirtualizedList {...followersList.listProps}></VirtualizedList>
            </View>
            <View
              style={followModal === "following" ? { flex: 1 } : { height: 0 }}
            >
              <VirtualizedList {...followingList.listProps}></VirtualizedList>
            </View>
          </View>
        </View>
      </Modal>
      <Pressable
        style={styles.countView}
        onPress={() => {
          followersList.startFetching();
          setFollowModal("followers");
        }}
      >
        <WhiteText>{userData.followersCount}</WhiteText>
        <WhiteText style={styles.fade}>followers</WhiteText>
      </Pressable>
      <Pressable
        style={styles.countView}
        onPress={() => {
          followingList.startFetching();
          setFollowModal("following");
        }}
      >
        <WhiteText>{userData.followingCount}</WhiteText>
        <WhiteText style={styles.fade}>following</WhiteText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "black",
  },
  topView: {
    padding: 15,
    height: 120,
    flexDirection: "row",
    borderColor: "gray",
    borderBottomWidth: 1,
  },
  countsView: {
    flexDirection: "row",
    gap: 15,
  },
  countView: {
    flexDirection: "row",
    gap: 1,
  },
  bottomView: {
    flex: 1,
  },
  leftPart: {
    justifyContent: "space-between",
    flex: 5,
  },
  buttonsView: {
    flex: 3,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "black",
  },
  button: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    width: 100,
    textAlign: "center",
    padding: 5,
    alignItems: "center",
  },
  fade: {
    opacity: 0.8,
  },
  tabButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    opacity: 0.7,
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  activeTab: {
    opacity: 1,
    borderBottomWidth: 2,
    borderBottomColor: "gray",
  },
  modal: {
    flex: 1,
    justifyContent: "flex-end",
  },
  closeView: { flex: 1 },
  modalView: {
    borderTopWidth: 1,
    borderTopColor: "white",
    flex: 9,
    backgroundColor: "black",
  },
  icon: {
    height: 35,
    width: 35,
    objectFit: "contain",
  },
  title: {
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
});
