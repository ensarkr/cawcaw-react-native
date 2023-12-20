import { doubleReturn } from "../typings/global";
import {
  commentOnPostRequestBody,
  getCommentsResponse,
  getPostResponse,
  getPostsResponse,
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

    if (res.status) {
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

async function explorePostsRequest(
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

async function followingPostsRequest(
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

async function postRequest(postId: number): Promise<getPostResponse> {
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

async function postCommentsRequest(
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

export {
  signUpRequest,
  signInRequest,
  explorePostsRequest,
  likeOrUnlikePostRequest,
  followingPostsRequest,
  postRequest,
  postCommentsRequest,
  addCommentRequest,
};
