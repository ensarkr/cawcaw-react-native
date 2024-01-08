import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ToastAndroid } from "react-native";
import useCustomTextInput from "../../../hooks/useCustomTextInput";
import CustomTextInput from "../../../components/CustomTextInput";
import { signInRequest } from "../../../functions/requests";
import useAuth from "../../../context/useAuth";
import { router } from "expo-router";
import WhiteText from "../../../components/WhiteText";

export default function SignIn() {
  const username = useCustomTextInput({ uiName: "username" });
  const password = useCustomTextInput({ uiName: "password", isPassword: true });

  const [formError, setFormError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();

  const handleSubmit = async () => {
    setIsLoading(true);

    let doesPass = true;
    const inputs = [username, password];
    for (let i = 0; i < 2; i++) {
      doesPass = inputs[i].validate();
    }
    if (!doesPass) {
      setIsLoading(false);
      return;
    }

    const res = await signInRequest({
      username: username.props.value,
      password: password.props.value,
    });

    if (res.status) {
      setFormError(null);
      auth.setUserAndStorageFromToken(res.value);
      ToastAndroid.show("Signed in.", 200);
      router.back();
    } else {
      setFormError(res.message);
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.main}>
      <Text>Sign in</Text>
      <CustomTextInput
        {...username}
        multiline={false}
        style={styles.box}
      ></CustomTextInput>
      <CustomTextInput {...password} style={styles.box}></CustomTextInput>
      {formError !== null && <WhiteText>{formError}</WhiteText>}
      <Pressable
        style={[styles.box, styles.button]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text> SIGN IN</Text>
      </Pressable>
      <View style={styles.row}>
        <WhiteText>No account?</WhiteText>
        <Pressable onPress={() => router.replace("/auth/signUp")}>
          <WhiteText> Sign Up</WhiteText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  box: {
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: "white",
    height: 40,
  },
  row: {
    flexDirection: "row",
  },
});
