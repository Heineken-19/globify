import { useState, useEffect } from 'react';
import { DiscountService } from '../services/DiscountService';

interface Discount {
  id: number;
  name: string;
  discountPercentage: number;
  validFrom: string;
  validUntil: string;
}

export const useDiscount = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DiscountService.getAllDiscounts();
      setDiscounts(data);
    } catch (error) {
      setError('Hiba az akciók lekérdezésénél.');
    } finally {
      setLoading(false);
    }
  };

  const applyDiscount = async (name: string) => {
    try {
      const discount = await DiscountService.applyDiscount(name);
      return discount;
    } catch (error) {
      setError('Érvénytelen akció név.');
      return 0;
    }
  };

  return { discounts, loading, error, applyDiscount };
};
