import {
  StyleProp,
  ToastAndroid,
  ViewStyle,
  StyleSheet,
  VirtualizedListProps,
  View,
} from "react-native";
import {
  getPostsResponse,
  getUsersResponse,
  getCommentsResponse,
} from "../typings/http";
import { post, user, postComment, userPartial } from "../typings/database";
import { useRef, useState, useEffect } from "react";
import useAuth from "../context/useAuth";
import WhiteText from "../components/WhiteText";

const errorMarginMS = 100;

type useCustomListBase = {
  refetchWhenAuthChanges?: boolean;
  style?: StyleProp<ViewStyle>;
  onRefresh?: () => void;
};

type useCustomList = (
  | {
      type: "posts";
      fetchFunction: (page: number, endPage: Date) => Promise<getPostsResponse>;
      renderItem: (post: post) => React.ReactElement;
    }
  | {
      type: "users";
      fetchFunction: (page: number, endPage: Date) => Promise<getUsersResponse>;
      renderItem: (user: user) => React.ReactElement;
    }
  | {
      type: "comments";
      fetchFunction: (
        page: number,
        endPage: Date
      ) => Promise<getCommentsResponse>;
      renderItem: (postComment: postComment) => React.ReactElement;
    }
) &
  useCustomListBase;

type getType<T extends "posts" | "users" | "comments"> = T extends "posts"
  ? post
  : T extends "users"
  ? user
  : T extends "comments"
  ? postComment
  : never;

export default function useCustomList({
  type,
  renderItem,
  style,
  onRefresh,
  fetchFunction,
}: useCustomList) {
  const fetchFunctionRef = useRef(fetchFunction);
  const pageRef = useRef(0);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<(post | postComment | userPartial)[]>([]);
  const endDateRef = useRef(new Date(Date.now() + errorMarginMS));
  const pageCountRef = useRef<number | null>(null);
  const isAllPagesFinishedRef = useRef(false);
  const didItStartRef = useRef(false);

  const setItemsOperation = async (
    reset: boolean,
    newFetchFunction?: typeof fetchFunction
  ) => {
    if (newFetchFunction) fetchFunctionRef.current = newFetchFunction;

    if (isAllPagesFinishedRef.current && !reset) {
      return;
    }

    setRefreshing(true);

    if (reset) {
      isAllPagesFinishedRef.current = false;
      pageCountRef.current = null;
      pageRef.current = 0;
      endDateRef.current = new Date(Date.now() + errorMarginMS);
    }

    const res = await fetchFunctionRef.current(
      pageRef.current++,
      endDateRef.current
    );

    if (res.status) {
      if (reset) setItems([]);

      switch (type) {
        case "posts":
          setItems((pv) => [...pv, ...(res.value as any).posts]);
          break;
        case "users":
          setItems((pv) => [...pv, ...(res.value as any).users]);
          break;
        case "comments":
          setItems((pv) => [...pv, ...(res.value as any).comments]);
          break;
      }

      pageCountRef.current = res.value.pageCount;

      if (pageCountRef.current === pageRef.current) {
        isAllPagesFinishedRef.current = true;
      }
    } else {
      if (res.message.includes("Page")) {
        isAllPagesFinishedRef.current = true;
        if (pageRef.current === 1) {
          setItems([]);
        }
      } else {
        ToastAndroid.show(res.message, 250);
      }
    }

    setRefreshing(false);
  };

  const virtualizedListProps = {
    data: items,
    getItem: (data, index) => data[index],
    getItemCount: (data) => data.length,
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => renderItem(item as any),
  } as Required<
    Pick<
      VirtualizedListProps<getType<typeof type>>,
      "data" | "getItem" | "getItemCount" | "keyExtractor" | "renderItem"
    >
  >;

  return {
    listProps: {
      ListHeaderComponentStyle: { gap: 10 },
      contentContainerStyle: [
        style,
        type === "posts" ? styles.list : styles.listNoPadding,
      ],
      refreshing,
      onRefresh: async () => {
        await setItemsOperation(true);
        if (onRefresh) onRefresh();
      },
      onEndReached: () => {
        if (didItStartRef.current === false) return;
        if (!refreshing) setItemsOperation(false);
      },
      onEndReachedThreshold: 0.5,
      ListFooterComponent:
        refreshing || items.length < 10 ? (
          <></>
        ) : (
          <View style={styles.lastElement}>
            <WhiteText>You have reached to the end.</WhiteText>
          </View>
        ),
      ListEmptyComponent:
        !didItStartRef.current || refreshing ? (
          <></>
        ) : (
          <View style={styles.centeredView}>
            <WhiteText>No {type} found</WhiteText>
          </View>
        ),

      ...virtualizedListProps,
    },
    items,
    refreshing,
    startFetching: (newFetchFunction?: typeof fetchFunction) => {
      didItStartRef.current = true;
      setItemsOperation(true, newFetchFunction);
    },
    didItStart: didItStartRef.current,
  };
}

const styles = StyleSheet.create({
  list: {
    minHeight: "100%",
    padding: 5,
    gap: 10,
    backgroundColor: "black",
    paddingTop: 10,
    paddingBottom: 15,
  },
  lastElement: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listNoPadding: {
    minHeight: "100%",
    gap: 10,
    backgroundColor: "black",
    paddingTop: 10,
    paddingBottom: 15,
  },
});
