import { useState } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User } from "./AuthContext";
import { AuthContext } from "./AuthContext";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {

  // ✅ Lazy initialization (runs once)
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading] = useState<boolean>(false);

  const login = (token: string, userData: User): void => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};