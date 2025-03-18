import { useState } from "react";
import { register } from "../services/AuthService";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    try {
      await register(email, password);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ismeretlen hiba történt.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error, success };
};
