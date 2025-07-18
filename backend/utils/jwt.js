import jwt from "jsonwebtoken";

export function createToken(tokenData) {
  return jwt.sign(tokenData.payload, process.env.secret_key, tokenData.config);
}

export async function verifyToken(token) {
  try {
    jwt.verify(token, process.env.secret_key);
    return true;
  } catch {
    return false;
  }
}
