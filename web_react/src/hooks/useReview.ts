import { useState, useEffect } from 'react';
import { ReviewService } from '../services/ReviewService';

export interface Review {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const useReviews = (productId: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchReviews();
      fetchAverageRating();
    }
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ReviewService.getReviewsByProduct(productId);
      setReviews(data);
      calculateAverage(data);
    } catch (error) {
      setError('Hiba a vélemények lekérdezésénél');
    } finally {
      setLoading(false);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const data = await ReviewService.getAverageRating(productId);
      setAverageRating(data);
    } catch (error) {
      console.error('Hiba az átlagos értékelés lekérdezésénél:', error);
    }
  };

  const calculateAverage = (data: Review[]) => {
    if (data.length === 0) {
      setAverageRating(0);
      return;
    }
    const total = data.reduce((acc, review) => acc + review.rating, 0);
    setAverageRating(total / data.length);
  };

  const addReview = async (userId: number, rating: number, comment: string) => {
    try {
      await ReviewService.addReview(userId, productId, rating, comment);
      fetchReviews(); // Frissítjük a véleményeket
      fetchAverageRating(); // Frissítjük az átlagot
    } catch (error) {
      console.error('Hiba vélemény hozzáadásánál:', error);
    }
  };

  const deleteReview = async (userId: number, reviewId: number) => {
    try {
      await ReviewService.deleteReview(userId, reviewId);
      fetchReviews(); // Frissítjük a véleményeket
      fetchAverageRating(); // Frissítjük az átlagot
    } catch (error) {
      console.error('Hiba vélemény törlésénél:', error);
    }
  };

  return {
    reviews,
    averageRating,
    loading,
    error,
    fetchReviews, // 🔥 HOZZÁADVA!
    addReview,
    deleteReview,
  };
};
