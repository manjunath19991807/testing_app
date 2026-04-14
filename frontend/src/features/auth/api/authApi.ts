import { getJson, postJson } from "../../../lib/apiClient";
import { AuthSession, AuthUser, LoginInput, SignupInput } from "../types";

export const authApi = {
  async signup(
    input: SignupInput,
  ): Promise<{ user: AuthUser; message: string }> {
    console.log(input);
    return postJson("/auth/signup", input);
  },

  async login(input: LoginInput): Promise<AuthSession> {
    return postJson("/auth/login", input);
  },

  async getMe(): Promise<AuthUser> {
    const response = await getJson<{ user: AuthUser }>("/auth/me");
    return response.user;
  },
};
