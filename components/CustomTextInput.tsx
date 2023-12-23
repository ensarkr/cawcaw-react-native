import useCustomTextInput from "../hooks/useCustomTextInput";
import { Text, TextInput, TextInputProps } from "react-native";

export default function CustomTextInput(
  props: TextInputProps & ReturnType<typeof useCustomTextInput>
) {
  return (
    <>
      <TextInput
        {...props.props}
        style={[
          { color: "white" },
          props.props.value.length === 0 ? { opacity: 0.8 } : {},
        ]}
        placeholderTextColor="white"
        multiline
      ></TextInput>
      {props.errorMessage !== null && <Text>{props.errorMessage}</Text>}
    </>
  );
}
