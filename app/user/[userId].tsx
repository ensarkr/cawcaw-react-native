import { useLocalSearchParams } from "expo-router";
import UserPageComponent from "../../components/UserPageComponent";

export default function UserPage() {
  const { userId } = useLocalSearchParams();

  return (
    <UserPageComponent
      type="guest"
      userId={parseInt(userId as string)}
    ></UserPageComponent>
  );
}
