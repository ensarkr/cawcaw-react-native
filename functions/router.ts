import { router } from "expo-router";
import { auth } from "../context/useAuth";

function pushUserRoute(auth: auth, userId: number) {
  if (auth.status === "user" && auth.id === userId) {
    router.push("/profile");
  } else {
    router.push("/user/" + userId);
  }
}

export { pushUserRoute };
