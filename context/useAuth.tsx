import { createContext, useContext, useEffect, useState } from "react";
import { user, userPartial } from "../typings/database";
import * as SecureStorage from "expo-secure-store";
import { decodeJWTPayload, expirationCheckJWTPayload } from "../functions/jwt";

const AuthContext = createContext<userPartial | null>(null);
const SetAuthContext = createContext<React.Dispatch<
  React.SetStateAction<userPartial | null>
> | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<null | userPartial>(null);

  useEffect(() => {
    const asyncOperation = async () => {
      const jwt_token = await SecureStorage.getItemAsync("jwt_token");

      if (jwt_token === null) return;

      const payload = decodeJWTPayload(jwt_token);

      if (!expirationCheckJWTPayload(payload)) {
        await SecureStorage.deleteItemAsync("jwt_token");
        return;
      }

      setAuth({
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
        id: payload.userId,
        username: payload.username,
        displayName: payload.displayName,
      });
    }
  };

  const signOut = async () => {
    await SecureStorage.deleteItemAsync("jwt_token");
    if (setUser !== null) setUser(null);
  };

  return {
    user: useContext(AuthContext),
    setUser,
    setUserAndStorageFromToken,
    signOut,
  };
}
