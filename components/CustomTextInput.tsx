import useCustomTextInput from "../hooks/useCustomTextInput";
import { Text, TextInput } from "react-native";

export default function CustomTextInput(
  props: ReturnType<typeof useCustomTextInput>
) {
  return (
    <>
      <TextInput {...props.props}></TextInput>
      {props.errorMessage !== null && <Text>{props.errorMessage}</Text>}
    </>
  );
}
