import { useState } from "react";
import { importProducts } from "../../services/admin/AdminImportService";

export const useAdminImport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImport = async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await importProducts(file);
      setSuccess(result);
    } catch (err: any) {
      setError(err.response?.data || "Hiba történt az importálás során.");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleImport,
    loading,
    error,
    success,
  };
};
