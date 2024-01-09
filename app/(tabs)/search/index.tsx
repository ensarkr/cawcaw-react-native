import React, { memo, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  VirtualizedList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WhiteText from "../../../components/WhiteText";
import {
  searchPostsRequest,
  searchUsersRequest,
} from "../../../functions/requests";
import Post from "../../../components/Post";
import { post, user } from "../../../typings/database";
import User from "../../../components/User";
import useCustomTextInput from "../../../hooks/useCustomTextInput";
import CustomTextInput from "../../../components/CustomTextInput";
import useCustomList from "../../../hooks/useCustomList";

type tabs = "posts" | "users";

const Post_MEMO = memo(Post);
const User_MEMO = memo(User);

export default function SearchPage() {
  const safeArea = useSafeAreaInsets();
  const [tab, setTab] = useState<tabs>("posts");
  const search = useCustomTextInput({ uiName: "search", limit: 150 });
  const postsList = useCustomList({
    type: "posts",
    fetchFunction: (page: number, endPage: Date) =>
      searchPostsRequest(page, endPage, "blank"),
    renderItem: (post: post) => <Post_MEMO type="post" post={post}></Post_MEMO>,
  });
  const userList = useCustomList({
    type: "users",
    fetchFunction: (page: number, endPage: Date) =>
      searchUsersRequest(page, endPage, "blank"),
    renderItem: (user: user) => <User_MEMO user={user}></User_MEMO>,
  });

  return (
    <View style={[{ paddingTop: safeArea.top }, styles.view]}>
      <View style={styles.searchView}>
        <CustomTextInput
          containerProps={{ style: styles.inputContainer }}
          inputProps={{ ...search, style: styles.input }}
        ></CustomTextInput>
        <Pressable
          onPress={() => {
            postsList.startFetching((page: number, endPage: Date) =>
              searchPostsRequest(page, endPage, search.props.value)
            );
            userList.startFetching((page: number, endPage: Date) =>
              searchUsersRequest(page, endPage, search.props.value)
            );
          }}
        >
          <Image
            style={styles.icon}
            source={require("../../../assets/search-regular-36.png")}
          ></Image>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => setTab("posts")}
          style={[styles.tabButton, tab === "posts" ? styles.activeTab : {}]}
        >
          <WhiteText>POSTS</WhiteText>
        </Pressable>
        <Pressable
          onPress={() => setTab("users")}
          style={[styles.tabButton, tab === "users" ? styles.activeTab : {}]}
        >
          <WhiteText>USERS</WhiteText>
        </Pressable>
      </View>

      <View style={tab === "posts" ? { flex: 1 } : { height: 0 }}>
        <VirtualizedList {...postsList.listProps}></VirtualizedList>
      </View>
      <View style={tab === "users" ? { flex: 1 } : { height: 0 }}>
        <VirtualizedList {...userList.listProps}></VirtualizedList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: "black" },
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
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputContainer: {
    flex: 14,
    justifyContent: "center",
    paddingRight: 20,
  },
  input: {
    height: 40,
    fontSize: 15,
  },
  icon: {
    flex: 1,
    height: 25,
    width: 25,
    objectFit: "contain",
  },
});
