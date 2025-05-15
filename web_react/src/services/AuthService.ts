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
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error("Hibás email vagy jelszó.");
      }
        if (error.response.status === 403 && error.response.data === "EMAIL_NOT_VERIFIED") {
          throw new Error("EMAIL_NOT_VERIFIED");
        }
      }
      throw new Error("Bejelentkezés sikertelen!");
  }
};

export const register = async (email: string, password: string, referralCode?: string) => {
  try {
    const response = await api.post("/api/auth/register", { email, password, referralCode });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        // 🔥 Backend válaszban kapott hibaüzenet lekérése
        const message = error.response.data;
        throw new Error(message);
      }
    }
    throw new Error("Regisztráció sikertelen!");
  }
};

export const logout = () => {
  localStorage.removeItem("token"); // 🔹 Token törlése kijelentkezéskor
};

export const sendVerificationEmail = async (email: string) => {
  return api.post('/api/auth/send-verification-email', { email });
};

export const verifyEmail = async (token: string) => {
  try {
    const response = await api.get(`/api/auth/verify-email?token=${token}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error("Hibás vagy lejárt token.");
      }
    }
    throw new Error("Sikertelen hitelesítés.");
  }
};

export const sendPasswordResetEmail = async (email: string) => {
  const response = await api.post("/api/auth/request-password-reset", { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.post("/api/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
};

export const sendGuestCheckoutLink = async (email: string) => {
  try {
    const response = await api.post("/api/auth/guest-checkout-link", { email });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw new Error("Hiba történt a vendég link kiküldése során.");
  }
};
