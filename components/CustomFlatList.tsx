import { ReactElement, useEffect, useRef, useState } from "react";
import { post, postComment, user, userPartial } from "../typings/database";
import { doubleReturn } from "../typings/global";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { explorePostsRequest } from "../functions/requests";
import {
  getCommentsResponse,
  getPostsResponse,
  getUsersResponse,
} from "../typings/http";

type CustomFlatListSameProps = {
  noItemError?: string;
  firstElement?: React.ReactElement;
  lastElement?: React.ReactElement;
  firstRenderAlways?: boolean;
  lastRenderAlways?: boolean;
};

type CustomFlatListProps = (
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
  CustomFlatListSameProps;

export default function CustomFlatList({
  type,
  fetchFunction,
  renderItem,
  firstElement,
  lastElement,
  noItemError,
  firstRenderAlways = false,
  lastRenderAlways = false,
}: CustomFlatListProps) {
  const pageRef = useRef(0);
  const endDateRef = useRef(new Date(Date.now()));
  const pageCountRef = useRef<number | null>(null);
  const isAllPagesFinishedRef = useRef(false);
  const [refreshing, setRefreshing] = useState(true);
  const [items, setItems] = useState<(post | postComment | userPartial)[]>([]);

  const setItemsOperation = async (reset: boolean) => {
    if (isAllPagesFinishedRef.current && !reset) {
      return;
    }

    setRefreshing(true);

    if (reset) {
      isAllPagesFinishedRef.current = false;
      pageCountRef.current = null;
      pageRef.current = 0;
      endDateRef.current = new Date(Date.now());
    }

    endDateRef.current = new Date(Date.now());
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
      }
    }

    setRefreshing(false);
  };

  useEffect(() => {
    setItemsOperation(false);
  }, []);

  return (
    <>
      <FlatList
        refreshing={refreshing}
        onRefresh={() => setItemsOperation(true)}
        style={{ flex: 1 }}
        data={items}
        renderItem={({ item }) => renderItem(item as any)}
        onEndReached={async () => await setItemsOperation(false)}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          firstRenderAlways
            ? firstElement
            : items.length > 0
            ? firstElement
            : undefined
        }
        ListFooterComponent={
          lastRenderAlways
            ? lastElement
            : items.length > 0 && !refreshing
            ? lastElement
            : undefined
        }
        ListEmptyComponent={
          refreshing ? (
            <></>
          ) : (
            <View>
              <Text>{noItemError || "No item can be found."}</Text>
            </View>
          )
        }
      />
    </>
  );
}
