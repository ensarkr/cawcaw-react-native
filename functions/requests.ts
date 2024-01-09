import { DocumentPickerAsset } from "expo-document-picker";
import { doubleReturn } from "../typings/global";
import {
  commentOnPostRequestBody,
  createPostResponseBody,
  getCommentsResponse,
  getPostResponse,
  getPostsResponse,
  getUserResponse,
  getUsersResponse,
  signInResponseBody,
  signUpResponseBody,
} from "../typings/http";
import * as SecureStorage from "expo-secure-store";

function returnURLWithQueries(url: string, queryObject: Record<string, any>) {
  const keys = Object.keys(queryObject);

  url += "?";

  for (let i = 0; i < keys.length; i++) {
    if (i != 0) {
      url += "&";
    }

    url += keys[i] + "=" + encodeURIComponent(queryObject[keys[i]]);
  }

  return url;
}

async function signUpRequest({
  displayName,
  username,
  password,
  rePassword,
}: {
  displayName: string;
  username: string;
  password: string;
  rePassword: string;
}): Promise<signUpResponseBody> {
  try {
    const res = await fetch(
      (process.env.EXPO_PUBLIC_API_URL as string) + "/auth/signUp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          username,
          password,
          rePassword,
        }),
      }
    );

    if (res.status === 200) {
      return { status: true };
    }

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
    return { status: false, message: (e as Error).message };
  }
}

async function signInRequest({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<signInResponseBody> {
  try {
    const res = await fetch(
      (process.env.EXPO_PUBLIC_API_URL as string) + "/auth/signIn",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
    return { status: false, message: (e as Error).message };
  }
}

async function getExplorePostsRequest(
  page: number,
  endDate: Date
): Promise<getPostsResponse> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    const res = await fetch(
      returnURLWithQueries(
        (process.env.EXPO_PUBLIC_API_URL as string) + "/data/posts/explore",
        { page, endDate }
      ),
      {
        method: "GET",
        headers:
          jwt_token !== null
            ? {
                authorization: jwt_token,
              }
            : {},
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

async function likeOrUnlikePostRequest(
  postId: number,
  type: "like" | "unlike"
): Promise<doubleReturn<undefined>> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");
    if (jwt_token === null) {
      return { status: false, message: "Not signed in." };
    }

    const res = await fetch(
      (process.env.EXPO_PUBLIC_API_URL as string) + "/action/" + type,
      {
        method: "POST",
        headers: {
          authorization: jwt_token,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ postId: postId }),
      }
    );

    if (res.status === 200) {
      return { status: true };
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

async function followOrUnfollowUserRequest(
  userId: number,
  type: "follow" | "unfollow"
): Promise<doubleReturn<undefined>> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");
    if (jwt_token === null) {
      return { status: false, message: "Not signed in." };
    }

    const res = await fetch(
      (process.env.EXPO_PUBLIC_API_URL as string) + "/action/" + type,
      {
        method: "POST",
        headers: {
          authorization: jwt_token,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ targetId: userId }),
      }
    );

    if (res.status === 200) {
      return { status: true };
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

async function getFollowingPostsRequest(
  page: number,
  endDate: Date
): Promise<getPostsResponse> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    const res = await fetch(
      returnURLWithQueries(
        (process.env.EXPO_PUBLIC_API_URL as string) + "/data/posts/following",
        { page, endDate }
      ),
      {
        method: "GET",
        headers:
          jwt_token !== null
            ? {
                authorization: jwt_token,
              }
            : {},
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

async function getPostRequest(postId: number): Promise<getPostResponse> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    const res = await fetch(
      (process.env.EXPO_PUBLIC_API_URL as string) + "/data/post/" + postId,

      {
        method: "GET",
        headers:
          jwt_token !== null
            ? {
                authorization: jwt_token,
              }
            : {},
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

async function addCommentRequest(
  postId: number,
  comment: string
): Promise<doubleReturn<undefined>> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    if (jwt_token === null) {
      return { status: false, message: "Not signed in." };
    }

    const res = await fetch(
      (process.env.EXPO_PUBLIC_API_URL as string) + "/action/comment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          authorization: jwt_token,
        },
        body: JSON.stringify({
          postId,
          comment,
        } as commentOnPostRequestBody),
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

async function getPostCommentsRequest(
  postId: number,
  page: number,
  endDate: Date
): Promise<getCommentsResponse> {
  try {
    const res = await fetch(
      returnURLWithQueries(
        (process.env.EXPO_PUBLIC_API_URL as string) +
          "/data/post/" +
          postId +
          "/comments",
        { page, endDate }
      ),
      {
        method: "GET",
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

async function createPostRequest(
  text: string,
  image: DocumentPickerAsset | null
): Promise<createPostResponseBody> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    if (jwt_token === null) {
      return { status: false, message: "Not signed in." };
    }

    const formData = new FormData();
    formData.append("text", text);

    if (image !== null) {
      formData.append("isThereAnImage", "yes");
      formData.append("image", {
        name: image.name,
        type: image.mimeType,
        uri: image.uri,
      } as any);
    } else {
      formData.append("isThereAnImage", "no");
    }

    const res = await fetch(
      (process.env.EXPO_PUBLIC_API_URL as string) + "/post/create",
      {
        method: "POST",
        headers: {
          authorization: jwt_token,
        },
        body: formData,
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

async function getPublicUserRequest(userId: number): Promise<getUserResponse> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    const res = await fetch(
      (process.env.EXPO_PUBLIC_API_URL as string) + "/data/user/" + userId,
      {
        method: "GET",
        headers:
          jwt_token !== null
            ? {
                authorization: jwt_token,
              }
            : {},
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

async function getUserPostsRequest(
  page: number,
  endDate: Date,
  userId: number
): Promise<getPostsResponse> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    const res = await fetch(
      returnURLWithQueries(
        (process.env.EXPO_PUBLIC_API_URL as string) +
          "/data/user/" +
          userId +
          "/posts",
        { page, endDate }
      ),
      {
        method: "GET",
        headers:
          jwt_token !== null
            ? {
                authorization: jwt_token,
              }
            : {},
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}
async function getUserLikesRequest(
  page: number,
  endDate: Date,
  userId: number
): Promise<getPostsResponse> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    const res = await fetch(
      returnURLWithQueries(
        (process.env.EXPO_PUBLIC_API_URL as string) +
          "/data/user/" +
          userId +
          "/likes",
        { page, endDate }
      ),
      {
        method: "GET",
        headers:
          jwt_token !== null
            ? {
                authorization: jwt_token,
              }
            : {},
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}
async function getUserComments(
  page: number,
  endDate: Date,
  userId: number
): Promise<getCommentsResponse> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    const res = await fetch(
      returnURLWithQueries(
        (process.env.EXPO_PUBLIC_API_URL as string) +
          "/data/user/" +
          userId +
          "/comments",
        { page, endDate }
      ),
      {
        method: "GET",
        headers:
          jwt_token !== null
            ? {
                authorization: jwt_token,
              }
            : {},
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}
async function getUserFollowersRequest(
  page: number,
  endDate: Date,
  userId: number
): Promise<getUsersResponse> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    const res = await fetch(
      returnURLWithQueries(
        (process.env.EXPO_PUBLIC_API_URL as string) +
          "/data/user/" +
          userId +
          "/followers",
        { page, endDate }
      ),
      {
        method: "GET",
        headers:
          jwt_token !== null
            ? {
                authorization: jwt_token,
              }
            : {},
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

async function getUserFollowingsRequest(
  page: number,
  endDate: Date,
  userId: number
): Promise<getUsersResponse> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    const res = await fetch(
      returnURLWithQueries(
        (process.env.EXPO_PUBLIC_API_URL as string) +
          "/data/user/" +
          userId +
          "/followings",
        { page, endDate }
      ),
      {
        method: "GET",
        headers:
          jwt_token !== null
            ? {
                authorization: jwt_token,
              }
            : {},
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

async function searchPostsRequest(
  page: number,
  endDate: Date,
  searchQuery: string
): Promise<getPostsResponse> {
  if (searchQuery.length === 0)
    return { status: true, value: { pageCount: 0, posts: [] } };

  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    const res = await fetch(
      returnURLWithQueries(
        (process.env.EXPO_PUBLIC_API_URL as string) + "/data/posts/search",
        { page, endDate, searchQuery }
      ),
      {
        method: "GET",
        headers:
          jwt_token !== null
            ? {
                authorization: jwt_token,
              }
            : {},
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}
async function searchUsersRequest(
  page: number,
  endDate: Date,
  searchQuery: string
): Promise<getUsersResponse> {
  try {
    const jwt_token = await SecureStorage.getItemAsync("jwt_token");

    const res = await fetch(
      returnURLWithQueries(
        (process.env.EXPO_PUBLIC_API_URL as string) + "/data/users/search",
        { page, endDate, searchQuery }
      ),
      {
        method: "GET",
        headers:
          jwt_token !== null
            ? {
                authorization: jwt_token,
              }
            : {},
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return { status: false, message: (e as Error).message };
  }
}

export {
  signUpRequest,
  signInRequest,
  getExplorePostsRequest,
  likeOrUnlikePostRequest,
  getFollowingPostsRequest,
  getPostRequest,
  getPostCommentsRequest,
  addCommentRequest,
  createPostRequest,
  getPublicUserRequest,
  getUserPostsRequest,
  getUserLikesRequest,
  getUserComments,
  getUserFollowersRequest,
  followOrUnfollowUserRequest,
  getUserFollowingsRequest,
  searchPostsRequest,
  searchUsersRequest,
};
