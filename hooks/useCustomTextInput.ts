import React, { useState } from "react";

export default function useCustomTextInput({
  uiName,
  isPassword = false,
  placeholder,
  limit,
}: {
  uiName: string;
  isPassword?: boolean;
  placeholder?: string;
  limit?: number;
}) {
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  return {
    props: {
      value,
      placeholder: placeholder || uiName,
      onChangeText: setValue,
      secureTextEntry: isPassword,
      maxLength: limit,
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
