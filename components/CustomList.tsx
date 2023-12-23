import { useEffect, useRef, useState } from "react";
import { post, postComment, userPartial } from "../typings/database";
import {
  VirtualizedList,
  View,
  ToastAndroid,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import {
  getCommentsResponse,
  getPostsResponse,
  getUsersResponse,
} from "../typings/http";
import useAuth from "../context/useAuth";
import WhiteText from "./WhiteText";

type CustomListSameProps = {
  noItemError?: string;
  firstElement?: React.ReactElement;
  lastElement?: React.ReactElement;
  lastRenderAlways?: boolean;
  refetchWhenAuthChanges?: boolean;
  style?: StyleProp<ViewStyle>;
  onRefresh?: () => void;
};

type CustomListProps = (
  | {
      type: "posts";
      fetchFunction: (page: number, endPage: Date) => Promise<getPostsResponse>;
      renderItem: (post: post) => React.ReactElement;
    }
  | {
      type: "users";
      fetchFunction: (page: number, endPage: Date) => Promise<getUsersResponse>;
      renderItem: (userPartial: userPartial) => React.ReactElement;
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
  CustomListSameProps;

const errorMarginMS = 100;

export default function CustomList({
  type,
  fetchFunction,
  renderItem,
  firstElement,
  lastElement,
  noItemError,
  lastRenderAlways = false,
  refetchWhenAuthChanges = true,
  style,
  onRefresh,
}: CustomListProps) {
  const pageRef = useRef(0);
  const endDateRef = useRef(new Date(Date.now() + errorMarginMS));
  const pageCountRef = useRef<number | null>(null);
  const isAllPagesFinishedRef = useRef(false);
  const [refreshing, setRefreshing] = useState(true);
  const [items, setItems] = useState<(post | postComment | userPartial)[]>([]);
  const auth = useAuth();
  const fetchQueueRef = useRef<boolean[]>([]);
  const fetchInProcessRef = useRef<boolean>(false);

  const setItemsOperation = async (reset: boolean) => {
    if (fetchInProcessRef.current === true) {
      fetchQueueRef.current.push(reset);
      return;
    }
    fetchInProcessRef.current = true;

    if (isAllPagesFinishedRef.current && !reset) {
      fetchInProcessRef.current = false;
      if (fetchQueueRef.current.length !== 0) {
        setItemsOperation(fetchQueueRef.current.shift() as boolean);
      }
      return;
    }

    setRefreshing(true);

    if (reset) {
      isAllPagesFinishedRef.current = false;
      pageCountRef.current = null;
      pageRef.current = 0;
      endDateRef.current = new Date(Date.now() + errorMarginMS);
    }

    const res = await fetchFunction(pageRef.current++, endDateRef.current);

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
      } else {
        ToastAndroid.show(res.message, 250);
      }
    }

    setRefreshing(false);
    fetchInProcessRef.current = false;
    if (fetchQueueRef.current.length !== 0) {
      setItemsOperation(fetchQueueRef.current.shift() as boolean);
    }
  };

  useEffect(() => {
    if (refetchWhenAuthChanges === false) setItemsOperation(true);
  }, []);

  useEffect(() => {
    if (refetchWhenAuthChanges === true) setItemsOperation(true);
  }, [auth.user]);

  return (
    <>
      <VirtualizedList
        ListHeaderComponentStyle={{ gap: 10 }}
        contentContainerStyle={[style, styles.list]}
        refreshing={refreshing}
        onRefresh={async () => {
          await setItemsOperation(true);
          if (onRefresh) onRefresh();
        }}
        style={{ flex: 1 }}
        data={items}
        getItem={(data, index) => data[index]}
        getItemCount={(data) => data.length}
        keyExtractor={(data) => data.id}
        renderItem={({ item }) => renderItem(item as any)}
        onEndReached={() => {
          setItemsOperation(false);
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={firstElement}
        ListFooterComponent={
          lastRenderAlways
            ? lastElement
            : items.length > 5 && isAllPagesFinishedRef.current === true
            ? lastElement
            : undefined
        }
        ListEmptyComponent={
          refreshing ? (
            <></>
          ) : (
            <View style={styles.lastElement}>
              <WhiteText>
                {noItemError || "No " + type + " can be found."}
              </WhiteText>
            </View>
          )
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    minHeight: "100%",
  },
  lastElement: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
