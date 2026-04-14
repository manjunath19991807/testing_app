import { Router } from "express";
import { authMiddleware } from "../../app/middlewares/authMiddleware.js";
import { validateRequest } from "../../app/middlewares/validateRequest.js";
import { loginSchema, signupSchema } from "../../schemas/authSchemas.js";
import { getUserById, loginUser, signupUser } from "./service.js";

export const authRouter = Router();

authRouter.post("/signup", validateRequest(signupSchema), async (request, response, next) => {
  try {
    const result = await signupUser(request.body);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", validateRequest(loginSchema), async (request, response, next) => {
  try {
    const result = await loginUser(request.body);
    response.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", authMiddleware, async (request, response, next) => {
  try {
    const user = await getUserById(request.authUser!.id);
    response.json({ user });
  } catch (error) {
    next(error);
  }
});
