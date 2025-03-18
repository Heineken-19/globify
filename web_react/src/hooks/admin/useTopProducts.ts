import { useState, useEffect } from "react";
import AdminService from "../../services/admin/AdminService";
import { AdminProduct } from "../../types";



export function useTopProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topProducts, setTopProducts] = useState<AdminProduct[]>([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await AdminService.getTopProducts();
        setTopProducts(data);
      } catch (err) {
        setError("Nem sikerült lekérni a top termékeket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return {
    topProducts,
    loading,
    error,
  };
}
