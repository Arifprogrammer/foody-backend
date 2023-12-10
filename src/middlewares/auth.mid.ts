import { HTTP_UNAUTHORIZED } from "../constants/http_status";
import jwt from "jsonwebtoken";

export default (req: any, res: any, next: any) => {
  const token = req.headers.access_token;
  if (!token) {
    return res.status(HTTP_UNAUTHORIZED).send({ error: true, message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).send({ error: true, message: "unauthorized token" });
    }
    req.decoded = decoded;
    next();
  });
};
