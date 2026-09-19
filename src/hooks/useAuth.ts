import { useState, useEffect } from "react";
import type { User } from "@/types/email";
import { MOCK_USER } from "@/lib/mockData";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("iqmail_user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setAuthState({ user, isLoading: false, isAuthenticated: true });
      } catch {
        localStorage.removeItem("iqmail_user");
        setAuthState({ user: null, isLoading: false, isAuthenticated: false });
      }
    } else {
      setAuthState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  const login = (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const user = { ...MOCK_USER, email };
          localStorage.setItem("iqmail_user", JSON.stringify(user));
          setAuthState({ user, isLoading: false, isAuthenticated: true });
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1200);
    });
  };

  const logout = () => {
    localStorage.removeItem("iqmail_user");
    setAuthState({ user: null, isLoading: false, isAuthenticated: false });
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updated = { ...authState.user, ...updates };
      localStorage.setItem("iqmail_user", JSON.stringify(updated));
      setAuthState((prev) => ({ ...prev, user: updated }));
    }
  };

  return {
    ...authState,
    login,
    logout,
    updateUser,
  };
}
