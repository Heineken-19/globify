import { useState } from "react";
import { register } from "../services/AuthService";
import { useNotification } from "../context/NotificationContext";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleRegister = async (email: string, password: string, referralCode?: string) => {
    setLoading(true);
    setError(null); 
    setSuccess(false); 
    try {
      await register(email, password, referralCode);
      showSuccess("Regisztráció sikeres, megerősítő emailt küldtünk a megadott emailre!");
      setSuccess(true); // ✅ Csak akkor állítjuk be sikeresre, ha valóban sikerült
    } catch (err) {
      setSuccess(false); // ❌ Ha hiba van, ne állítsuk be sikeresre
      if (err instanceof Error) {
        setError(err.message); // 🔥 Backend hibaüzenet beállítása
      } else {
        setError("Ismeretlen hiba történt.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error, success };
};
