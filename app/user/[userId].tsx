import { Link, router, useLocalSearchParams } from "expo-router";
import { memo, useState, useEffect } from "react";
import {
  ToastAndroid,
  View,
  Modal,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomList from "../../components/CustomList";
import Post from "../../components/Post";
import User, { FollowButton } from "../../components/User";
import WhiteText from "../../components/WhiteText";
import useAuth from "../../context/useAuth";
import {
  getPublicUserRequest,
  getUserPostsRequest,
  getUserComments,
  getUserLikesRequest,
  getUserFollowersRequest,
  getUserFollowingsRequest,
} from "../../functions/requests";
import { user, postComment, post } from "../../typings/database";
import Comment from "../../components/Comment";

const Post_MEMO = memo(Post);
const Comment_MEMO = memo(Comment);
const User_MEMO = memo(User);

type tabs = "posts" | "comments" | "likes";
type modals = "none" | "following" | "followers";

export default function UserPage() {
  const { userId } = useLocalSearchParams();
  const safeArea = useSafeAreaInsets();
  const [userData, setUserData] = useState<user | null>(null);
  const [tab, setTab] = useState<tabs>("posts");
  const [followModal, setFollowModal] = useState<modals>("none");

  const auth = useAuth();

  useEffect(() => {
    const asyncOperation = async (userId: number) => {
      const res = await getPublicUserRequest(userId);

      if (!res.status) {
        router.back();
        ToastAndroid.show(res.message, 200);
        return;
      }

      setUserData(res.value);
    };

    asyncOperation(parseInt(userId as string));
  }, []);

  const getCustomList = (tab: tabs, userId: number) => {
    switch (tab) {
      case "posts":
        return (
          <CustomList
            key="posts"
            style={styles.list}
            type="posts"
            fetchFunction={(page: number, endPage: Date) =>
              getUserPostsRequest(page, endPage, userId)
            }
            renderItem={(post: post) => (
              <Post_MEMO type="post" post={post}></Post_MEMO>
            )}
            refetchWhenAuthChanges={false}
            lastElement={
              <View style={styles.lastElement}>
                <WhiteText>You have reached to the end.</WhiteText>
              </View>
            }
          ></CustomList>
        );
      case "comments":
        return (
          <CustomList
            key="comments"
            style={styles.list}
            type="comments"
            fetchFunction={(page: number, endPage: Date) =>
              getUserComments(page, endPage, userId)
            }
            renderItem={(comment: postComment) => (
              <Comment_MEMO comment={comment}></Comment_MEMO>
            )}
            refetchWhenAuthChanges={false}
            lastElement={
              <View style={styles.lastElement}>
                <WhiteText>You have reached to the end.</WhiteText>
              </View>
            }
          ></CustomList>
        );
      case "likes":
        return (
          <CustomList
            key="likes"
            style={styles.list}
            type="posts"
            fetchFunction={(page: number, endPage: Date) =>
              getUserLikesRequest(page, endPage, userId)
            }
            renderItem={(post: post) => (
              <Post_MEMO type="post" post={post}></Post_MEMO>
            )}
            refetchWhenAuthChanges={false}
            lastElement={
              <View style={styles.lastElement}>
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
            <View style={styles.modal}>
              <Pressable
                style={styles.closeView}
                onPress={() => setFollowModal("none")}
              ></Pressable>
              <View style={styles.modalView}>
                <View style={styles.header}>
                  <WhiteText style={styles.title}>
                    {userData.followersCount} FOLLOWERS
                  </WhiteText>
                  <Pressable
                    onPress={() => {
                      setFollowModal("none");
                    }}
                  >
                    <Image
                      style={styles.icon}
                      source={require("../../assets/x-regular-36.png")}
                    ></Image>
                  </Pressable>
                </View>
                <CustomList
                  style={styles.list}
                  type="users"
                  fetchFunction={(page: number, endPage: Date) =>
                    getUserFollowersRequest(page, endPage, userData.id)
                  }
                  renderItem={(user: user) => (
                    <User_MEMO
                      user={user}
                      doBeforeNavigation={() => setFollowModal("none")}
                    ></User_MEMO>
                  )}
                  refetchWhenAuthChanges={false}
                  lastElement={
                    <View style={styles.lastElement}>
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
            <View style={styles.modal}>
              <Pressable
                style={styles.closeView}
                onPress={() => setFollowModal("none")}
              ></Pressable>
              <View style={styles.modalView}>
                <View style={styles.header}>
                  <WhiteText style={styles.title}>
                    {userData.followingCount} FOLLOWING
                  </WhiteText>
                  <Pressable
                    onPress={() => {
                      setFollowModal("none");
                    }}
                  >
                    <Image
                      style={styles.icon}
                      source={require("../../assets/x-regular-36.png")}
                    ></Image>
                  </Pressable>
                </View>
                <CustomList
                  style={styles.list}
                  type="users"
                  fetchFunction={(page: number, endPage: Date) =>
                    getUserFollowingsRequest(page, endPage, userData.id)
                  }
                  renderItem={(user: user) => (
                    <User_MEMO
                      user={user}
                      doBeforeNavigation={() => setFollowModal("none")}
                    ></User_MEMO>
                  )}
                  refetchWhenAuthChanges={false}
                  lastElement={
                    <View style={styles.lastElement}>
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

  return (
    <View style={[{ paddingTop: safeArea.top }, styles.view]}>
      {userData !== null && (
        <>
          <View style={styles.topView}>
            <View style={styles.leftPart}>
              <View>
                <WhiteText> {userData.displayName}</WhiteText>
                <WhiteText style={styles.fade}>@{userData.username}</WhiteText>
              </View>

              <View style={styles.countsView}>
                {getModal(followModal, userData)}
                <Pressable
                  style={styles.countView}
                  onPress={() => {
                    setFollowModal("followers");
                  }}
                >
                  <WhiteText>{userData.followersCount}</WhiteText>
                  <WhiteText style={styles.fade}>followers</WhiteText>
                </Pressable>
                <Pressable
                  style={styles.countView}
                  onPress={() => {
                    setFollowModal("following");
                  }}
                >
                  <WhiteText>{userData.followingCount}</WhiteText>
                  <WhiteText style={styles.fade}>following</WhiteText>
                </Pressable>
              </View>
            </View>
            <View style={styles.buttonsView}>
              {auth &&
              auth.user.status === "user" &&
              auth.user.id === userData.id ? (
                <Pressable
                  style={styles.button}
                  onPress={() => router.push("/(tabs)/profile")}
                >
                  <WhiteText>PROFILE</WhiteText>
                </Pressable>
              ) : (
                <FollowButton
                  userId={userData.id}
                  requestedFollows={userData.requestedFollows}
                ></FollowButton>
              )}
            </View>
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={() => setTab("posts")}
                style={[
                  styles.tabButton,
                  tab === "posts" ? styles.activeTab : {},
                ]}
              >
                <WhiteText>POSTS</WhiteText>
              </Pressable>
              <Pressable
                onPress={() => setTab("comments")}
                style={[
                  styles.tabButton,
                  tab === "comments" ? styles.activeTab : {},
                ]}
              >
                <WhiteText>COMMENTS</WhiteText>
              </Pressable>
              <Pressable
                onPress={() => setTab("likes")}
                style={[
                  styles.tabButton,
                  tab === "likes" ? styles.activeTab : {},
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
