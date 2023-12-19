import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function User() {
  const { userId } = useLocalSearchParams();

  return (
    <View>
      <Text>User id: {userId}</Text>
      <Pressable
        style={{ margin: 0, padding: 0 }}
        onPress={() => {
          router.replace("/user/" + (parseInt(userId as string) + 1));
        }}
      >
        <Text> Next: {parseInt(userId as string) + 1}</Text>
      </Pressable>
      <Link href={"/user/" + (parseInt(userId as string) + 1)}>
        Next: {parseInt(userId as string) + 1}
      </Link>
    </View>
  );
}
