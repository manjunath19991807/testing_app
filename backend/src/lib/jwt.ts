import jwt from "jsonwebtoken";
import { env } from "./env.js";

type JwtPayload = {
  sub: string;
  email: string;
};

export function signAuthToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "7d"
  });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
