import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import useCustomTextInput from "../../../hooks/useCustomTextInput";
import CustomTextInput from "../../../components/TextInput";
import { signUpRequest } from "../../../functions/requests";

export default function SignUp() {
  const displayName = useCustomTextInput("display name", false);
  const username = useCustomTextInput("username", false);
  const password = useCustomTextInput("password", true);
  const rePassword = useCustomTextInput("repeat password", true);

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
    } else {
      setFormError(res.message);
    }

    setIsLoading(false);
  };

  return (
    <View>
      <Text>Sign up</Text>
      {formError !== null && <Text>{formError}</Text>}
      <CustomTextInput {...displayName}></CustomTextInput>
      <CustomTextInput {...username}></CustomTextInput>
      <CustomTextInput {...password}></CustomTextInput>
      <CustomTextInput {...rePassword}></CustomTextInput>

      <Button title="sign up" onPress={handleSubmit} disabled={isLoading} />
    </View>
  );
}
