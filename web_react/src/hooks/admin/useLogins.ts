import { useState, useEffect, useCallback } from "react";
import AdminService from "../../services/admin/AdminService";

interface LoginStats {
  date: string;
  logins: number;
}

export function useLogins() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logins, setLogins] = useState<LoginStats[]>([]);

  const getDailyLogins = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const loginData: LoginStats[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= new Date(endDate)) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        const data = await AdminService.getLoginsCount(formattedDate);
        loginData.push({
          date: formattedDate,
          logins: data.logins || 0,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setLogins(loginData);
    } catch (err) {
      setError("Nem sikerült lekérni a bejelentkezési statisztikákat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    getDailyLogins(formattedStartDate, today);
  }, [getDailyLogins]);

  return {
    logins,
    loading,
    error,
    getDailyLogins,
  };
}
