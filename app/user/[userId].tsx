import { Link, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function User() {
  const { userId } = useLocalSearchParams();

  return (
    <View>
      <Text>User id: {userId}</Text>
      <Link href={"/user/" + (parseInt(userId as string) + 1)}>
        Next: {parseInt(userId as string) + 1}
      </Link>
    </View>
  );
}
