export type AuthUser = {
  id: string;
  email: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  email: string;
  password: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
};
