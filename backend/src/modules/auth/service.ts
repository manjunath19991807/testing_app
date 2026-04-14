import bcrypt from "bcryptjs";
import { signAuthToken } from "../../lib/jwt.js";
import { AuthError } from "./errors.js";
import { UserModel } from "./model.js";

type PublicUser = {
  id: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: PublicUser;
};

export async function signupUser(input: {
  email: string;
  password: string;
}): Promise<{ user: PublicUser; message: string }> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const existingUser = await UserModel.findOne({ email: normalizedEmail }).lean();

  if (existingUser) {
    throw new AuthError("An account with that email already exists.", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await UserModel.create({
    email: normalizedEmail,
    passwordHash
  });

  return {
    user: {
      id: user.id,
      email: user.email
    },
    message: "Account created successfully."
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const user = await UserModel.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AuthError("Invalid email or password.", 401);
  }

  const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);

  if (!isValidPassword) {
    throw new AuthError("Invalid email or password.", 401);
  }

  return {
    token: signAuthToken({
      sub: user.id,
      email: user.email
    }),
    user: {
      id: user.id,
      email: user.email
    }
  };
}

export async function getUserById(id: string): Promise<PublicUser> {
  const user = await UserModel.findById(id).lean();

  if (!user) {
    throw new AuthError("User not found.", 404);
  }

  return {
    id: String(user._id),
    email: user.email
  };
}
