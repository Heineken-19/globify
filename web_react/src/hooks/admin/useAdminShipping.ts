import { useState, useEffect } from 'react';
import AdminShippingService from '../../services/admin/AdminShippingService';
import {ShippingOption, ShippingOptionInput} from '../../types';

export const useAdminShipping = () => {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [shippingMethods, setShippingMethods] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

   // 🔹 Szállítási módok lekérdezése backendből
   const fetchShippingOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminShippingService.getAllShippingOptions();

      // ✅ Tábla frissítése
      setShippingOptions(data);

      // ✅ Select opciók feltöltése az adatbázisból
      const methods = data.map((option) => ({
        value: option.method,
        label: getLabelForMethod(option.method),
      }));

      setShippingMethods(methods);
    } catch (err) {
      setError('Hiba a szállítási díjak lekérdezése során.');
    } finally {
      setLoading(false);
    }
  };

   // 🔹 Új szállítási mód létrehozása
   const createShippingOption = async (shippingOption: ShippingOptionInput) => {
    setLoading(true);
    try {
      const newOption = await AdminShippingService.createShippingOption(shippingOption);
      setShippingOptions((prev) => [...prev, newOption]);
    } catch (err) {
      setError('Hiba a szállítási díj létrehozásakor.');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Szállítási mód módosítása
  const updateShippingOption = async (id: number, shippingOption: ShippingOptionInput) => {
    setLoading(true);
    try {
      const updatedOption = await AdminShippingService.updateShippingOption(id, shippingOption);
      setShippingOptions((prev) =>
        prev.map((option) => (option.id === id ? updatedOption : option))
      );
    } catch (err) {
      setError('Hiba a szállítási díj frissítésekor.');
    } finally {
      setLoading(false);
    }
  };

   // 🔹 Szállítási mód törlése
   const deleteShippingOption = async (id: number) => {
    setLoading(true);
    try {
      await AdminShippingService.deleteShippingOption(id);
      setShippingOptions((prev) => prev.filter((option) => option.id !== id));
    } catch (err) {
      setError('Hiba a szállítási díj törlésekor.');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Magyar nyelvű megjelenítés
  const getLabelForMethod = (method: string) => {
    switch (method) {
      case 'HOME_DELIVERY':
        return 'Házhoz szállítás';
      case 'FOXPOST':
        return 'FoxPost';
      case 'PACKETA':
        return 'Packeta';
      case 'SHOP':
        return 'Üzletben átvétel';
      default:
        return method;
    }
  };

  useEffect(() => {
    fetchShippingOptions();
  }, []);

  return {
    shippingOptions,
    shippingMethods,
    loading,
    error,
    createShippingOption,
    updateShippingOption,
    deleteShippingOption,
    fetchShippingOptions,
  };
};
