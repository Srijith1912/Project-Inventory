import { createContext, useContext, useEffect, useState } from "react";
import { setAdminToken, clearAdminToken } from "../api";

const AuthContext = createContext(null);

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "pantry2024";

const STORAGE_KEY = "pantrypro_admin_auth";

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAdminToken(password);
      setIsAdmin(true);
      return { ok: true };
    }
    return { ok: false, error: "Invalid username or password" };
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    clearAdminToken();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
