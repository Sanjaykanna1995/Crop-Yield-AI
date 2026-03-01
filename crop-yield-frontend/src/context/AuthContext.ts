import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);