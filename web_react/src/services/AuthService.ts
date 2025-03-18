import api from "./api";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    if (response.status !== 200) {
      throw new Error("Sikertelen bejelentkezés.");
    }
    const { token, user_id, role } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("role", role);

    return response.data;
  } catch (error) {
    console.error("Bejelentkezési hiba:", error);
    throw error;
  }
};

export const register = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/register", { email, password });
    return response.data;
  } catch (error) {
    throw new Error("Regisztráció sikertelen!");
  }
};

export const logout = () => {
  localStorage.removeItem("token"); // 🔹 Token törlése kijelentkezéskor
};

export const verifyEmail = async (token: string) => {
  try {
    const response = await api.get(`/api/auth/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    throw new Error("Érvénytelen vagy lejárt megerősítő link!");
  }
};
