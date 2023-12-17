function decodeJWTPayload(token: string) {
  global.Buffer = require("buffer").Buffer;

  const [encodedHeader, encodedPayload, signature] = token.split(".");

  return JSON.parse(
    Buffer.from(encodedPayload, "base64").toString("utf-8")
  ) as {
    iss: string;
    sub: string;
    iat: number;
    exp: number;
    userId: number;
    username: string;
    displayName: string;
  };
}

function expirationCheckJWTPayload(payload: {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
  userId: number;
  username: string;
  displayName: string;
}) {
  if (payload.exp < Date.now()) {
    return false;
  }
  return true;
}

export { decodeJWTPayload, expirationCheckJWTPayload };
