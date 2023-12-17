import { doubleReturn } from "../typings/global";
import { signInResponseBody, signUpResponseBody } from "../typings/http";

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

export { signUpRequest, signInRequest };
