import { Link, useFocusEffect } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuth from "../../../context/useAuth";
import WhiteText from "../../../components/WhiteText";
import { router } from "expo-router";
import {
  getFollowingPostsRequest,
  getPublicUserRequest,
  getUserComments,
  getUserFollowersRequest,
  getUserFollowingsRequest,
  getUserLikesRequest,
  getUserPostsRequest,
} from "../../../functions/requests";
import { postComment, user } from "../../../typings/database";
import CustomList from "../../../components/CustomList";
import Post from "../../../components/Post";
import { post } from "../../../typings/database";
import Comment from "../../../components/Comment";
import User from "../../../components/User";

const Post_MEMO = memo(Post);
const Comment_MEMO = memo(Comment);
const User_MEMO = memo(User);

type tabs = "posts" | "comments" | "likes";
type modals = "none" | "following" | "followers";

export default function ProfilePage() {
  const safeArea = useSafeAreaInsets();
  const [userData, setUserData] = useState<user | null>(null);
  const [tab, setTab] = useState<tabs>("posts");
  const [followModal, setFollowModal] = useState<modals>("none");

  const auth = useAuth();

  const getSetUserData = async (userId: number) => {
    const res = await getPublicUserRequest(userId);

    if (!res.status) {
      router.back();
      ToastAndroid.show(res.message, 200);
      return;
    }

    setUserData(res.value);
  };

  useFocusEffect(
    useCallback(() => {
      if (auth.user.status === "user") getSetUserData(auth.user.id);
    }, [auth.user.status])
  );

  const getCustomList = (tab: tabs, userId: number) => {
    switch (tab) {
      case "posts":
        return (
          <CustomList
            key="posts"
            style={userStyles.list}
            type="posts"
            fetchFunction={(page: number, endPage: Date) =>
              getUserPostsRequest(page, endPage, userId)
            }
            renderItem={(post: post) => (
              <Post_MEMO type="post" post={post}></Post_MEMO>
            )}
            refetchWhenAuthChanges={false}
            lastElement={
              <View style={userStyles.lastElement}>
                <WhiteText>You have reached to the end.</WhiteText>
              </View>
            }
          ></CustomList>
        );
      case "comments":
        return (
          <CustomList
            key="comments"
            style={userStyles.list}
            type="comments"
            fetchFunction={(page: number, endPage: Date) =>
              getUserComments(page, endPage, userId)
            }
            renderItem={(comment: postComment) => (
              <Comment_MEMO comment={comment}></Comment_MEMO>
            )}
            refetchWhenAuthChanges={false}
            lastElement={
              <View style={userStyles.lastElement}>
                <WhiteText>You have reached to the end.</WhiteText>
              </View>
            }
          ></CustomList>
        );
      case "likes":
        return (
          <CustomList
            key="likes"
            style={userStyles.list}
            type="posts"
            fetchFunction={(page: number, endPage: Date) =>
              getUserLikesRequest(page, endPage, userId)
            }
            renderItem={(post: post) => (
              <Post_MEMO type="post" post={post}></Post_MEMO>
            )}
            refetchWhenAuthChanges={false}
            lastElement={
              <View style={userStyles.lastElement}>
                <WhiteText>You have reached to the end.</WhiteText>
              </View>
            }
          ></CustomList>
        );
    }
  };

  const getModal = (modal: modals, userData: user) => {
    switch (modal) {
      case "followers":
        return (
          <Modal
            key="followers"
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
              setFollowModal("none");
            }}
          >
            <View style={userStyles.modal}>
              <Pressable
                style={userStyles.closeView}
                onPress={() => setFollowModal("none")}
              ></Pressable>
              <View style={userStyles.modalView}>
                <View style={userStyles.header}>
                  <WhiteText style={userStyles.title}>
                    {userData.followersCount} FOLLOWERS
                  </WhiteText>
                  <Pressable
                    onPress={() => {
                      setFollowModal("none");
                    }}
                  >
                    <Image
                      style={userStyles.icon}
                      source={require("../../../assets/x-regular-36.png")}
                    ></Image>
                  </Pressable>
                </View>
                <CustomList
                  style={userStyles.list}
                  type="users"
                  fetchFunction={(page: number, endPage: Date) =>
                    getUserFollowersRequest(page, endPage, userData.id)
                  }
                  renderItem={(user: user) => (
                    <User_MEMO
                      user={user}
                      doBeforeNavigation={() => setFollowModal("none")}
                      doAfterAction={() => {
                        if (auth.user.status === "user")
                          getSetUserData(auth.user.id);
                      }}
                    ></User_MEMO>
                  )}
                  refetchWhenAuthChanges={false}
                  lastElement={
                    <View style={userStyles.lastElement}>
                      <WhiteText>You have reached to the end.</WhiteText>
                    </View>
                  }
                ></CustomList>
              </View>
            </View>
          </Modal>
        );
      case "following":
        return (
          <Modal
            key="following"
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
              setFollowModal("none");
            }}
          >
            <View style={userStyles.modal}>
              <Pressable
                style={userStyles.closeView}
                onPress={() => setFollowModal("none")}
              ></Pressable>
              <View style={userStyles.modalView}>
                <View style={userStyles.header}>
                  <WhiteText style={userStyles.title}>
                    {userData.followingCount} FOLLOWING
                  </WhiteText>
                  <Pressable
                    onPress={() => {
                      setFollowModal("none");
                    }}
                  >
                    <Image
                      style={userStyles.icon}
                      source={require("../../../assets/x-regular-36.png")}
                    ></Image>
                  </Pressable>
                </View>
                <CustomList
                  style={userStyles.list}
                  type="users"
                  fetchFunction={(page: number, endPage: Date) =>
                    getUserFollowingsRequest(page, endPage, userData.id)
                  }
                  renderItem={(user: user) => (
                    <User_MEMO
                      user={user}
                      doBeforeNavigation={() => setFollowModal("none")}
                      doAfterAction={() => {
                        if (auth.user.status === "user")
                          getSetUserData(auth.user.id);
                      }}
                    ></User_MEMO>
                  )}
                  refetchWhenAuthChanges={false}
                  lastElement={
                    <View style={userStyles.lastElement}>
                      <WhiteText>You have reached to the end.</WhiteText>
                    </View>
                  }
                ></CustomList>
              </View>
            </View>
          </Modal>
        );
    }
  };

  if (auth.user.status === "user") {
    return (
      <View style={[{ paddingTop: safeArea.top }, userStyles.view]}>
        {userData !== null && (
          <>
            <View style={userStyles.topView}>
              <View style={userStyles.leftPart}>
                <View>
                  <WhiteText> {userData.displayName}</WhiteText>
                  <WhiteText style={userStyles.fade}>
                    @{userData.username}
                  </WhiteText>
                </View>

                <View style={userStyles.countsView}>
                  {getModal(followModal, userData)}
                  <Pressable
                    style={userStyles.countView}
                    onPress={() => {
                      setFollowModal("followers");
                    }}
                  >
                    <WhiteText>{userData.followersCount}</WhiteText>
                    <WhiteText style={userStyles.fade}>followers</WhiteText>
                  </Pressable>
                  <Pressable
                    style={userStyles.countView}
                    onPress={() => {
                      setFollowModal("following");
                    }}
                  >
                    <WhiteText>{userData.followingCount}</WhiteText>
                    <WhiteText style={userStyles.fade}>following</WhiteText>
                  </Pressable>
                </View>
              </View>
              <View style={userStyles.buttonsView}>
                <Pressable onPress={auth.signOut} style={userStyles.button}>
                  <WhiteText>SIGN OUT</WhiteText>
                </Pressable>
              </View>
            </View>
            <View>
              <View style={{ flexDirection: "row" }}>
                <Pressable
                  onPress={() => setTab("posts")}
                  style={[
                    userStyles.tabButton,
                    tab === "posts" ? userStyles.activeTab : {},
                  ]}
                >
                  <WhiteText>POSTS</WhiteText>
                </Pressable>
                <Pressable
                  onPress={() => setTab("comments")}
                  style={[
                    userStyles.tabButton,
                    tab === "comments" ? userStyles.activeTab : {},
                  ]}
                >
                  <WhiteText>COMMENTS</WhiteText>
                </Pressable>
                <Pressable
                  onPress={() => setTab("likes")}
                  style={[
                    userStyles.tabButton,
                    tab === "likes" ? userStyles.activeTab : {},
                  ]}
                >
                  <WhiteText>LIKES</WhiteText>
                </Pressable>
              </View>
            </View>
            {getCustomList(tab, userData.id)}
          </>
        )}
      </View>
    );
  }

  if (auth.user.status === "guest") {
    return (
      <View style={[{ paddingTop: safeArea.top }, guestStyles.view]}>
        <WhiteText>Sign in to see your profile.</WhiteText>
        <View style={guestStyles.buttonsView}>
          <Link href={"/auth/signIn"} style={guestStyles.button}>
            <WhiteText>SIGN IN</WhiteText>
          </Link>
          <Link href={"/auth/signUp"} style={guestStyles.button}>
            <WhiteText>SIGN UP</WhiteText>
          </Link>
        </View>
      </View>
    );
  }
}

const userStyles = StyleSheet.create({
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
  list: {
    padding: 5,
    gap: 10,
    backgroundColor: "black",
    paddingTop: 10,
    paddingBottom: 15,
  },
  lastElement: {
    paddingTop: 15,
    justifyContent: "center",
    alignItems: "center",
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
const guestStyles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
    backgroundColor: "black",
  },
  buttonsView: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    backgroundColor: "black",
  },
  button: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    width: 120,
    textAlign: "center",
    padding: 5,
  },
});
