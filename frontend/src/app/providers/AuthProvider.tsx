import { ReactNode, createContext, useEffect, useState } from "react";
import { authApi } from "../../features/auth/api/authApi";
import { AuthContextValue, AuthSession, AuthUser } from "../../features/auth/types";

const authStorageKey = "csv-analytics-session";

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedValue = window.localStorage.getItem(authStorageKey);

    if (!storedValue) {
      return null;
    }

    const session = JSON.parse(storedValue) as AuthSession;
    return session.user;
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(authStorageKey);

    if (!storedValue) {
      setIsReady(true);
      return;
    }

    authApi
      .getMe()
      .then((nextUser) => {
        setUser(nextUser);
      })
      .catch(() => {
        window.localStorage.removeItem(authStorageKey);
        setUser(null);
      })
      .finally(() => {
        setIsReady(true);
      });

    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isReady,
    login(session) {
      window.localStorage.setItem(authStorageKey, JSON.stringify(session));
      setUser(session.user);
    },
    logout() {
      window.localStorage.removeItem(authStorageKey);
      setUser(null);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
