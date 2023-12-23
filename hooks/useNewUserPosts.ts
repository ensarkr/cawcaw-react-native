import { useState } from "react";
import { post } from "../typings/database";
import { DocumentPickerAsset } from "expo-document-picker";

export default function useNewUserPosts() {
  const [userPosts, setUserPosts] = useState<post[]>([]);
  const clearUserPosts = () => setUserPosts([]);
  const addNewUserPost = (
    displayName: string,
    username: string,
    userId: number,
    postText: string,
    image: (DocumentPickerAsset & { aspectRatio: number }) | null,
    postId: number
  ) => {
    setUserPosts((pv) => [
      {
        id: postId,
        userId: userId,
        displayName: displayName,
        username: username,
        insertedAt: new Date(Date.now()),
        aspectRatio: image === null ? null : image.aspectRatio,
        imageUrl: image === null ? null : image.uri,
        commentsCount: 0,
        likesCount: 0,
        requestedLiked: false,
        text: postText,
      } as post,
      ...pv,
    ]);
  };

  return {
    userPosts,
    setUserPosts,
    clearUserPosts,
    addNewUserPost,
  };
}
