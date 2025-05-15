import { useState } from "react";
import { verifyEmail } from "../services/AuthService";

export const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const handleVerifyEmail = async (token: string) => {
    setLoading(true);
    try {
      await verifyEmail(token);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return { handleVerifyEmail, loading, status };
};
