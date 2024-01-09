import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ToastAndroid } from "react-native";
import useCustomTextInput from "../../../hooks/useCustomTextInput";
import CustomTextInput from "../../../components/CustomTextInput";
import { signUpRequest } from "../../../functions/requests";
import WhiteText from "../../../components/WhiteText";
import { router } from "expo-router";

export default function SignUp() {
  const displayName = useCustomTextInput({
    uiName: "display name",
    checkEmptiness: true,
  });
  const username = useCustomTextInput({
    uiName: "username",
    checkEmptiness: true,
  });
  const password = useCustomTextInput({
    uiName: "password",
    isPassword: true,
    checkEmptiness: true,
    minLength: 8,
  });
  const rePassword = useCustomTextInput({
    uiName: "repeat password",
    isPassword: true,
    checkEmptiness: true,
    minLength: 8,
  });

  const [formError, setFormError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setFormError(null);
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

    if (password.props.value.trim() !== rePassword.props.value.trim()) {
      setFormError("Passwords do not match.");
      return;
    }

    const res = await signUpRequest({
      displayName: displayName.props.value.trim(),
      username: username.props.value.trim(),
      password: password.props.value.trim(),
      rePassword: rePassword.props.value.trim(),
    });

    if (res.status) {
      router.replace("/auth/signIn");
      ToastAndroid.show("Successfully signed up.", 200);
    } else {
      setFormError(res.message);
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.main}>
      <View style={styles.form}>
        <CustomTextInput
          inputProps={{ ...displayName, style: styles.box }}
        ></CustomTextInput>
        <CustomTextInput
          inputProps={{ ...username, style: styles.box }}
        ></CustomTextInput>
        <CustomTextInput
          inputProps={{ ...password, style: styles.box }}
        ></CustomTextInput>
        <CustomTextInput
          inputProps={{ ...rePassword, style: styles.box }}
        ></CustomTextInput>
        {formError !== null && <WhiteText>{formError}</WhiteText>}

        <Pressable
          style={[styles.box, styles.button]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text> SIGN UP</Text>
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
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    width: 250,
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
