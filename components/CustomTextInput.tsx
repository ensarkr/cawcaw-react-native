import useCustomTextInput from "../hooks/useCustomTextInput";
import { TextInput, TextInputProps } from "react-native";
import WhiteText from "./WhiteText";

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
          props.style,
        ]}
        placeholderTextColor="white"
        multiline={props.multiline !== undefined ? props.multiline : true}
      ></TextInput>
      {props.errorMessage !== null && (
        <WhiteText>{props.errorMessage}</WhiteText>
      )}
    </>
  );
}
