function checkEmpty(
  state: string,
  uiName: string,
  setErrorMessage: (value: string) => {}
) {
  if (state.length < 0) {
    setErrorMessage(
      uiName[0].toLocaleUpperCase() + uiName.slice(1) + " cannot be empty."
    );
    return false;
  }
  return true;
}

export { checkEmpty };
