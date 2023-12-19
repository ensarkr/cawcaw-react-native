import { Text, TextStyle } from "react-native";

export default function WhiteText({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: TextStyle;
}) {
  return <Text style={[style, { color: "white" }]}>{children}</Text>;
}
