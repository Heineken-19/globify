import { useState, useEffect } from 'react';
import { ShippingService } from '../services/ShippingService';

export const useShipping = (subtotal: number, selectedShippingMethod: string) => {
  const [shippingCost, setShippingCost] = useState<number>(1500); // Alapértelmezett költség
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subtotal > 0 && selectedShippingMethod) {
      fetchShippingCost(selectedShippingMethod);
    }
  }, [subtotal, selectedShippingMethod]);

  const fetchShippingCost = async (method: string) => {
    setLoading(true);
    try {
      const cost = await ShippingService.getShippingCost(method, subtotal);
      setShippingCost(cost);
    } catch (err) {
      setError('Hiba történt a szállítási költség lekérésekor.');
    } finally {
      setLoading(false);
    }
  };

  return {
    shippingCost,
    loading,
    error,
    fetchShippingCost,
  };
};
