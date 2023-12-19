import React, { useState } from "react";

export default function useCustomTextInput(
  uiName: string,
  isPassword: boolean
) {
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  return {
    props: {
      value,
      placeholder: uiName,
      onChangeText: setValue,
      secureTextEntry: isPassword,
    },
    errorMessage,
    setValue,
    validate: () => {
      setErrorMessage(null);
      return checkEmptiness(value, uiName, setErrorMessage);
    },
  };
}

function checkEmptiness(
  value: string,
  uiName: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
) {
  if (value.length > 0) {
    return true;
  }
  setErrorMessage(
    uiName[0].toLocaleUpperCase() + uiName.slice(1) + " cannot be empty."
  );
  return false;
}
