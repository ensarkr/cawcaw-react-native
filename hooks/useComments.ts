import { useState } from "react";
import { postComment } from "../typings/database";

export default function useComment(postId: number) {
  const [userComments, setUserComments] = useState<postComment[]>([]);
  const clearUserComments = () => setUserComments([]);
  const addNewUserComment = (
    displayName: string,
    username: string,
    userId: number,
    comment: string
  ) => {
    setUserComments((pv) => [
      ...pv,
      {
        id: Math.random(),
        comment: comment,
        userId: userId,
        postId: postId,
        displayName: displayName,
        username: username,
        insertedAt: new Date(Date.now()),
      },
    ]);
  };

  return {
    userComments,
    setUserComments,
    clearUserComments,
    addNewUserComment,
  };
}
