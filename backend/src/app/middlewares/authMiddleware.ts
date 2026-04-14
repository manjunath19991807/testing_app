import { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../../lib/jwt.js";

export function authMiddleware(request: Request, response: Response, next: NextFunction) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return response.status(401).json({
      message: "Authentication required."
    });
  }

  try {
    const payload = verifyAuthToken(authorizationHeader.replace("Bearer ", "").trim());
    request.authUser = {
      id: payload.sub,
      email: payload.email
    };

    return next();
  } catch {
    return response.status(401).json({
      message: "Your session is invalid or has expired."
    });
  }
}
