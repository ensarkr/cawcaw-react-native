import React, { useState } from "react";

export default function useCustomTextInput({
  uiName,
  isPassword = false,
  placeholder,
  limit,
  multiline = false,
  checkEmptiness = false,
  minLength = 0,
}: {
  uiName: string;
  isPassword?: boolean;
  placeholder?: string;
  limit?: number;
  multiline?: boolean;
  checkEmptiness?: boolean;
  minLength?: number;
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
      multiline,
    },
    errorMessage,
    setValue,
    validate: () => {
      setValue(value.trim());
      setErrorMessage(null);
      if (checkEmptiness && !isEmpty(value.trim(), uiName, setErrorMessage))
        return false;
      if (!isLengthEnough(value.trim(), uiName, setErrorMessage, minLength))
        return false;
      return true;
    },
  };
}

function isEmpty(
  value: string,
  uiName: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
) {
  if (value.length > 0) {
    return true;
  }
  setErrorMessage(
    `${uiName[0].toLocaleUpperCase() + uiName.slice(1)} cannot be empty.`
  );
  return false;
}

function isLengthEnough(
  value: string,
  uiName: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  minLength: number
) {
  if (value.length >= minLength) {
    return true;
  }
  setErrorMessage(
    `${
      uiName[0].toLocaleUpperCase() + uiName.slice(1)
    } cannot be smaller then ${minLength}.`
  );
  return false;
}
