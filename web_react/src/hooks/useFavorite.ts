import { useState, useEffect } from "react";
import FavoriteService from "../services/FavoriteService";
import {  Product  } from "../types";

export const useFavorite = (userId: number) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


    const fetchFavorites = async () => {
      try {
        const data = await FavoriteService.getFavorites(userId);
        setFavorites(data);
      } catch (err) {
        setError("Nem sikerült betölteni a kedvenceket.");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (!userId) return;
      fetchFavorites();
    }, [userId]);

  const addFavorite = async (product: Product) => {
    try {
      await FavoriteService.addFavorite(userId, product.id);
      setFavorites((prev) => [...prev, { ...product }]); // Helyesíti a típust
    } catch (err) {
      console.error("Hiba történt a kedvencekhez adáskor:", err);
    }
  };
  

  const removeFavorite = async (productId: number) => {
    try {
      await FavoriteService.removeFavorite(userId, productId);
      setFavorites((prev) => prev.filter((fav) => fav.id !== productId)); // Frissítés
    } catch (err) {
      console.error("Hiba eltávolításkor:", err);
    }
  };

  return { favorites, loading, error, addFavorite, removeFavorite, fetchFavorites };
};
