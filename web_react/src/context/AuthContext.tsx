import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { login as apiLogin, logout as apiLogout, register, verifyEmail } from "../services/AuthService";
import { useNotification } from "./NotificationContext";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  handleLogin: (email: string, password: string) => Promise<boolean>;
  handleRegister: (email: string, password: string) => Promise<void>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    // ✅ Beállítjuk az állapotot, ha van token a localStorage-ben
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");
    if (token && userId && role) {
      setUser({ id: userId, email: "", role });
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { token, user_id, role } = await apiLogin(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("role", role);
      setUser({ id: user_id, email, role });
      setIsLoggedIn(true);

      // ✅ Context állapot frissítése
      window.dispatchEvent(new Event("auth-change"));
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Ismeretlen bejelentkezési hiba");
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      await register(email, password);
      showSuccess("✅ Sikeres regisztráció! Kérjük, erősítse meg az emailcímét.");
    } catch (err: any) {
      if (err.message === "Ez az email cím már használatban van.") {
        showError("⚠️ Ez az email cím már használatban van.");
      } else if (err.message === "Az Email cím nem megfelelő.") {
        showError("⚠️ Az Email cím nem megfelelő.");
      } else if (err.message === "A jelszónak legalább 6 karakter hosszúnak kell lennie.") {
        showError("⚠️ A jelszónak legalább 6 karakter hosszúnak kell lennie.");
      } else {
        showError("❌ Hiba történt a regisztráció során. Próbálja újra később.");
      }
      throw err;
    }
  };


  const handleLogout = () => {
    apiLogout();
    localStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
    showSuccess("Kijelentkezés sikeres!")
    // ✅ Context állapot frissítése kijelentkezés után
    window.dispatchEvent(new Event("auth-change"));
  };

  const value: AuthContextType = {
    user,
    isLoggedIn,
    handleLogin,
    handleRegister,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
