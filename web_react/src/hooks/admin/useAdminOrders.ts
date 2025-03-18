import { useState, useEffect, useCallback } from "react";
import AdminService from "../../services/admin/AdminService";

interface OrderStats {
  date: string;
  totalOrders: number;
}

export function useAdminOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderStats[]>([]);

  const getDailyOrders = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const orderData: OrderStats[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= new Date(endDate)) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        const data = await AdminService.getDailyOrderStats(formattedDate);
        orderData.push({
          date: formattedDate,
          totalOrders: data.totalOrders || 0, // Ha nincs rendelés, alapértelmezetten 0
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setOrders(orderData);
    } catch (err) {
      setError("Nem sikerült lekérni a rendelési statisztikákat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    getDailyOrders(formattedStartDate, today);
  }, [getDailyOrders]);

  return {
    orders,
    loading,
    error,
    getDailyOrders,
  };
}
