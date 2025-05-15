import { useState, useEffect } from "react";
import { login, logout } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";
import { useNotification } from "../context/NotificationContext";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("token"));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("user_id"));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("role"));
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const { showSuccess, showError } = useNotification();
  const [guestEmail, setGuestEmail] = useState<string | null>(localStorage.getItem("guest_email"));
  const isGuest = !!guestEmail && !isLoggedIn;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("user_id");
    const storedRole = localStorage.getItem("role");

    setToken(storedToken);
    setUserId(storedUserId);
    setUserRole(storedRole);
    setIsLoggedIn(!!storedToken);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      const role = localStorage.getItem("role");

      setToken(token);
      setUserId(userId);
      setUserRole(role);
      setIsLoggedIn(!!token);

      // ✅ Globális esemény indítása
      window.dispatchEvent(new Event("auth-change"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const { token, user_id, role } = await login(email, password);
      setToken(token);
      setUserId(user_id);
      setUserRole(role);
      setIsLoggedIn(true);

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("role", role);

      // ✅ Globális esemény elindítása
      window.dispatchEvent(new Event("auth-change"));
      showSuccess("Sikeres bejelentkezés!");
      return true;
    } catch (err) {
      showError("Bejelentkezés sikertelen");
      setError("Hibás bejelentkezési adatok!");
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    logout();
    setToken(null);
    setUserId(null);
    setUserRole(null);
    setIsLoggedIn(false);

    // ✅ Globális esemény elindítása kijelentkezés után
    window.dispatchEvent(new Event("auth-change"));

    navigate("/");
  };

  return {
    isLoggedIn,
    isGuest,
    userId,
    user,
    userRole,
    token,
    guestEmail,
    setGuestEmail,
    handleLogin,
    handleLogout,
    error,
  };
};
