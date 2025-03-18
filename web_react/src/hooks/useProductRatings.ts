import { useState, useEffect } from 'react';
import { ReviewService } from '../services/ReviewService';
import { Product } from '../types';

export const useProductRatings = (products: Product[]) => {
  const [averageRatings, setAverageRatings] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (products.length > 0) {
      fetchAverageRatings();
    }
  }, [products]);

  const fetchAverageRatings = async () => {
    try {
      const ratings = await Promise.all(
        products.map(async (product) => {
          const rating = await ReviewService.getAverageRating(product.id);
          return { productId: product.id, rating };
        })
      );

      const ratingMap = ratings.reduce((acc, { productId, rating }) => {
        acc[productId] = rating;
        return acc;
      }, {} as { [key: number]: number });

      setAverageRatings(ratingMap);
    } catch (error) {
      console.error('Hiba az átlagos értékelések lekérdezésénél:', error);
    }
  };

  return { averageRatings };
};
