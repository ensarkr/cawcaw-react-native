type dbDate = string;

type user = {
  id: number;
  username: string;
  displayName: string;
  description: string;
  followersCount: number;
  followingCount: number;
};

type userPartial = Pick<user, "id" | "username" | "displayName">;

type postComment = {
  id: number;
  userId: number;
  postId: number;
  comment: string;
  insertedAt: Date;
};

type post = {
  id: number;
  userId: number;
  text: string;
  imageUrl: string | null;
  likesCount: number;
  commentsCount: number;
  insertedAt: Date;
};

export {
  user,
  userPartial,
  postComment,
  post,
};
