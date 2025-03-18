import { useState } from "react";
import { login, logout } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("token"));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("user_id"));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("role"));
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  const handleLogin = async (email: string, password: string) => {
    try {
      const { token, user_id, role } = await login(email, password);
      setToken(token);
      setIsLoggedIn(true);
      setUserId(user_id);
      setUserRole(role);

    } catch (err) {
      setError("Hibás bejelentkezési adatok!");
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    logout();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  return { isLoggedIn, userId, userRole, token, handleLogin, handleLogout, error };
};
