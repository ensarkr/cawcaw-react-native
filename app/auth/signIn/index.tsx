import { useContext, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import useCustomTextInput from "../../../hooks/useCustomTextInput";
import CustomTextInput from "../../../components/TextInput";
import { signInRequest, signUpRequest } from "../../../functions/requests";

import * as SecureStorage from "expo-secure-store";
import useAuth from "../../../context/useAuth";

export default function SignIn() {
  const displayName = useCustomTextInput("display name", false);
  const username = useCustomTextInput("username", false);
  const password = useCustomTextInput("password", true);
  const rePassword = useCustomTextInput("repeat password", true);

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
    } else {
      setFormError(res.message);
    }

    setIsLoading(false);
  };

  return (
    <View>
      <Text>Sign up</Text>
      {formError !== null && <Text>{formError}</Text>}
      <CustomTextInput {...username}></CustomTextInput>
      <CustomTextInput {...password}></CustomTextInput>

      <Button title="sign in" onPress={handleSubmit} disabled={isLoading} />
    </View>
  );
}