import { Link, useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";
import useAuth from "../../context/useAuth";

export default function Post() {
  const { postId } = useLocalSearchParams();
  const auth = useAuth();

  return (
    <View>
      <Text>Post id: {postId}</Text>
      <Link href={"/post/" + (parseInt(postId as string) + 1)}>
        Next: {parseInt(postId as string) + 1}
      </Link>
      <Text>{auth.auth}</Text>
      <Button
        title="change context"
        onPress={() => {
          if (auth.setAuth === null) {
            console.log("null");
            return;
          }
          auth.setAuth(Math.random().toString());
        }}
      ></Button>
    </View>
  );
}