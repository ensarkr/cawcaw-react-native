import { doubleReturn } from "../typings/global";
import {
  getPostsResponse,
  signInResponseBody,
  signUpResponseBody,
} from "../typings/http";

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
    const res = await fetch(
      returnURLWithQueries(
        (process.env.EXPO_PUBLIC_API_URL as string) + "/data/posts/explore",
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

export { signUpRequest, signInRequest, explorePostsRequest };
