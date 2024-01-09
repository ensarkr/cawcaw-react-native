import useCustomTextInput from "../hooks/useCustomTextInput";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
} from "react-native";
import WhiteText from "./WhiteText";

export default function CustomTextInput({
  containerProps,
  inputProps,
}: {
  containerProps?: ViewProps;
  inputProps: TextInputProps & ReturnType<typeof useCustomTextInput>;
}) {
  return (
    <View {...containerProps}>
      <TextInput
        {...inputProps.props}
        style={[
          { color: "white" },
          inputProps.props.value.length === 0 ? { opacity: 0.8 } : {},
          inputProps.style,
        ]}
        placeholderTextColor="white"
      ></TextInput>

      {inputProps.errorMessage !== null && (
        <View style={styles.error}>
          <WhiteText>{inputProps.errorMessage}</WhiteText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  error: { padding: 5 },
});
