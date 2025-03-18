import { useState, useEffect } from "react";
import AdminService from "../../services/admin/AdminService";
import { RevenueData } from "../../types";

export function useRevenue() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weeklyRevenue, setWeeklyRevenue] = useState<RevenueData | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<RevenueData | null>(null);

  const getRevenue = async () => {
    setLoading(true);
    setError(null);
    try {
      const weekly = await AdminService.getRevenueStats("weekly");
      const monthly = await AdminService.getRevenueStats("monthly");

      setWeeklyRevenue({
        totalRevenue: weekly.totalRevenue || 0,
        startDate: weekly.startDate || "", // Backend válaszból
        endDate: weekly.endDate || "",
      });

      setMonthlyRevenue({
        totalRevenue: monthly.totalRevenue || 0,
        startDate: monthly.startDate || "",
        endDate: monthly.endDate || "",
      });
    } catch (err) {
      setError("Nem sikerült lekérni a bevételi adatokat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRevenue();
  }, []);

  return { weeklyRevenue, monthlyRevenue, loading, error };
}