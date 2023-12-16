import { createContext, useContext, useState } from "react";

const AuthContext = createContext<string | null>(null);
const SetAuthContext = createContext<React.Dispatch<
  React.SetStateAction<string>
> | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState("test");

  return (
    <SetAuthContext.Provider value={setAuth}>
      <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
    </SetAuthContext.Provider>
  );
}

export default function useAuth() {
  return { auth: useContext(AuthContext), setAuth: useContext(SetAuthContext) };
}
