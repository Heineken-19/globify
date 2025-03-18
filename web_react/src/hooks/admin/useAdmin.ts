import { useState, useEffect, useCallback } from "react";
import AdminService from "../../services/admin/AdminService";
import { RegistrationData } from "../../types";

export function useAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<{ date: string; count: number }[]>([]);
  const [users, setUsers] = useState<RegistrationData[]>([]);

// API hívás optimalizálása useCallback segítségével
const getRegistrations = useCallback(
  async (startDate: string, endDate: string): Promise<RegistrationData[]> => {
    setLoading(true);
    setError(null);
    try {
      const data: RegistrationData[] = await AdminService.getRegistrationsStats(startDate, endDate);
      return data; // 🔹 Az adatokat visszaadjuk, nem állítjuk be azonnal a state-et
    } catch (err) {
      setError("Nem sikerült lekérni a regisztrációs adatokat.");
      return [];
    } finally {
      setLoading(false);
    }
  },
  []
);

useEffect(() => {
  const fetchRegistrations = async () => {
    const today = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    const data = await getRegistrations(formattedStartDate, today);
    setUsers(data); // 🔹 Most állítjuk be az adatokat
  };

  fetchRegistrations();
}, [getRegistrations]); // 🔹 Most már nem frissül végtelen ciklusban


  const getUserActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminService.getUserActivity();
      setActivity(data);
    } catch (err) {
      setError("Nem sikerült lekérni a felhasználói aktivitási adatokat.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserActivity();
  }, []);

  return {
    loading,
    error,
    activity,
    users,
    getRegistrations,
  };
}
