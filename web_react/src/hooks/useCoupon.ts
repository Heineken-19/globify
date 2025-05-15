import { useState, useEffect } from 'react';
import { CouponService } from '../services/CouponService';


interface Coupon {
  id: number;
  code: string;
  discountPercentage: number;
  validFrom: string;
  validUntil: string;
  firstOrderOnly: boolean;
}

export const useCoupon = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null); // ✅ Alkalmazott kupon tárolása
  

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CouponService.getAllCoupons();
      setCoupons(data);
    } catch (error) {
      setError('Hiba a kuponok lekérdezésénél.');
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (code: string, isFirstOrder: boolean) => {
    setError(null);
    try {
      const discount = await CouponService.applyCoupon(code, isFirstOrder);
      const coupon = coupons.find((c) => c.code === code);

      if (coupon) {
        setAppliedCoupon(coupon);
        return discount;
      } else {
        setError('❌ Érvénytelen kuponkód.');
        setAppliedCoupon(null);
        return 0;
      }
    } catch (error) {
      setError('❌ Érvénytelen kuponkód.');
      setAppliedCoupon(null);
      return 0;
    }
  };

  // ✅ Végösszeg kiszámítása kupon alapján
  const calculateDiscountedTotal = (total: number) => {
    if (appliedCoupon) {
      const discount = (total * appliedCoupon.discountPercentage) / 100;
      return total - discount;
    }
    return total;
  };

  // ✅ Kupon törlése
  const clearCoupon = () => {
    setAppliedCoupon(null);
    setError(null);
    
  };

  const generateRewardCoupon = async (discountPercentage: number): Promise<Coupon | null> => {
    try {
      const coupon = await CouponService.generateRewardCoupon(discountPercentage);
      setCoupons((prev) => [...prev, coupon]); // hozzáadjuk a friss kuponhoz a listához
      return coupon;
    } catch (err) {
      setError('❌ Hiba történt a kupon generálásakor.');
      return null;
    }
  };

  return {
    coupons,
    loading,
    error,
    appliedCoupon,
    applyCoupon,
    calculateDiscountedTotal,
    clearCoupon,
    generateRewardCoupon,
  };
};
