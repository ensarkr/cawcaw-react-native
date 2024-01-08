import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ToastAndroid } from "react-native";
import useCustomTextInput from "../../../hooks/useCustomTextInput";
import CustomTextInput from "../../../components/CustomTextInput";
import { signUpRequest } from "../../../functions/requests";
import WhiteText from "../../../components/WhiteText";
import { router } from "expo-router";

export default function SignUp() {
  const displayName = useCustomTextInput({ uiName: "display name" });
  const username = useCustomTextInput({ uiName: "username" });
  const password = useCustomTextInput({ uiName: "password", isPassword: true });
  const rePassword = useCustomTextInput({
    uiName: "repeat password",
    isPassword: true,
  });

  const [formError, setFormError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    let doesPass = true;
    const inputs = [displayName, username, password, rePassword];
    for (let i = 0; i < 4; i++) {
      doesPass = inputs[i].validate();
    }
    if (!doesPass) {
      setIsLoading(false);
      return;
    }

    const res = await signUpRequest({
      displayName: displayName.props.value,
      username: username.props.value,
      password: password.props.value,
      rePassword: rePassword.props.value,
    });

    if (res.status) {
      setFormError(null);
      router.replace("/auth/signIn");
      ToastAndroid.show("Successfully signed up.", 200);
    } else {
      setFormError(res.message);
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.main}>
      <CustomTextInput style={styles.box} {...displayName}></CustomTextInput>
      <CustomTextInput style={styles.box} {...username}></CustomTextInput>
      <CustomTextInput style={styles.box} {...password}></CustomTextInput>
      <CustomTextInput style={styles.box} {...rePassword}></CustomTextInput>
      {formError !== null && <WhiteText>{formError}</WhiteText>}

      <Pressable
        style={[styles.box, styles.button]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text> SIGN UP</Text>
      </Pressable>
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
});
