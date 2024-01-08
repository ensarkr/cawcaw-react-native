import { createContext, useContext, useEffect, useState } from "react";
import { userPartial } from "../typings/database";
import * as SecureStorage from "expo-secure-store";
import { decodeJWTPayload, expirationCheckJWTPayload } from "../functions/jwt";

const AuthContext = createContext<auth>({ status: "guest" });
const SetAuthContext = createContext<React.Dispatch<
  React.SetStateAction<auth>
> | null>(null);

export type auth =
  | { status: "loading" }
  | { status: "guest" }
  | ({ status: "user" } & userPartial);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<auth>({ status: "loading" });

  useEffect(() => {
    const asyncOperation = async () => {
      const jwt_token = await SecureStorage.getItemAsync("jwt_token");

      if (jwt_token === null) {
        setAuth({
          status: "guest",
        });
        return;
      }

      const payload = decodeJWTPayload(jwt_token);

      if (!expirationCheckJWTPayload(payload)) {
        await SecureStorage.deleteItemAsync("jwt_token");
        return;
      }

      setAuth({
        status: "user",
        id: payload.userId,
        username: payload.username,
        displayName: payload.displayName,
      });
    };

    asyncOperation();
  }, []);

  return (
    <SetAuthContext.Provider value={setAuth}>
      <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
    </SetAuthContext.Provider>
  );
}

export default function useAuth() {
  const setUser = useContext(SetAuthContext);
  const setUserAndStorageFromToken = async (token: string) => {
    const payload = decodeJWTPayload(token);

    if (setUser !== null) {
      await SecureStorage.setItemAsync("jwt_token", token);

      setUser({
        status: "user",
        id: payload.userId,
        username: payload.username,
        displayName: payload.displayName,
      });
    }
  };

  const signOut = async () => {
    await SecureStorage.deleteItemAsync("jwt_token");
    if (setUser !== null) setUser({ status: "guest" });
  };

  return {
    user: useContext(AuthContext),
    setUser,
    setUserAndStorageFromToken,
    signOut,
  };
}
