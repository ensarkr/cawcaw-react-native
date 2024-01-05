import React, { memo, useState } from "react";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomList from "../../../components/CustomList";
import WhiteText from "../../../components/WhiteText";
import {
  getExplorePostsRequest,
  searchPostsRequest,
  searchUsersRequest,
} from "../../../functions/requests";
import Post from "../../../components/Post";
import { post, user } from "../../../typings/database";
import Comment from "../../../components/Comment";
import User from "../../../components/User";
import useCustomTextInput from "../../../hooks/useCustomTextInput";
import CustomTextInput from "../../../components/CustomTextInput";

type tabs = "posts" | "users";

const Post_MEMO = memo(Post);
const User_MEMO = memo(User);

export default function SearchPage() {
  const safeArea = useSafeAreaInsets();
  const [tab, setTab] = useState<tabs>("posts");
  const [searhQuery, setSearchQuery] = useState<string>("");
  const search = useCustomTextInput({ uiName: "search" });

  const getResults = (tab: tabs) => {
    switch (tab) {
      case "posts":
        return (
          <CustomList
            key={searhQuery + "posts"}
            style={styles.list}
            type="posts"
            fetchFunction={(page: number, endPage: Date) =>
              searchPostsRequest(page, endPage, searhQuery)
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
      case "users":
        return (
          <CustomList
            key={searhQuery + "users"}
            style={styles.list}
            type="users"
            fetchFunction={(page: number, endPage: Date) =>
              searchUsersRequest(page, endPage, searhQuery)
            }
            renderItem={(user: user) => <User_MEMO user={user}></User_MEMO>}
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

  return (
    <View style={[{ paddingTop: safeArea.top }, styles.view]}>
      <View style={styles.searchView}>
        <CustomTextInput {...search} style={styles.input}></CustomTextInput>
        <Pressable
          onPress={() => {
            setSearchQuery(search.props.value);
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
      {getResults(tab)}
    </View>
  );
}

const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: "black" },
  list: {
    padding: 5,
    gap: 10,
    backgroundColor: "black",
    paddingTop: 15,
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
  input: {
    height: 40,
    fontSize: 15,
    flex: 14,
  },
  icon: {
    flex: 1,
    height: 25,
    width: 25,
    objectFit: "contain",
  },
});
