import { verifyToken } from "../utils/jwt.js";

export default function (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "invalid token" });
    return;
  }
  if (verifyToken(token)) {
    next();
    return;
  }
  res.status(401).json({ message: "invalid token" });
}
