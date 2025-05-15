import { useState, useEffect } from "react";
import AdminService from "../../services/admin/AdminService";
import { RevenueData, MonthlyRevenue, WeeklyRevenue } from "../../types";

export function useRevenue() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monthlyRevenues, setMonthlyRevenues] = useState<MonthlyRevenue[]>([]); // 🔹 Új: 5 havi adat
  const [weeklyRevenues, setWeeklyRevenues] = useState<WeeklyRevenue[]>([]);
  
  const getRevenue = async () => {
    setLoading(true);
    setError(null);
    try {
      const last5Months = await AdminService.getMonthlyRevenueLast5();
      const last5Weeks = await AdminService.getWeeklyRevenueLast5();

      setMonthlyRevenues(last5Months);
      setWeeklyRevenues(last5Weeks);

    } catch (err) {
      setError("Nem sikerült lekérni a bevételi adatokat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRevenue();
  }, []);

  return { weeklyRevenues,  monthlyRevenues, loading, error };
}