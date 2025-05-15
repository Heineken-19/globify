import { useState, useEffect, useCallback } from "react";
import { getFavoritePickupPoint, saveFavoritePickupPoint } from "../services/FavoritePickupService";

export interface FoxPostPoint {
  place_id: string;
  name: string;
  city: string;
  zip: string;
  address: string;
}

export const useFavoritePickup = () => {
  const [favoritePoint, setFavoritePoint] = useState<FoxPostPoint | null>(null);

  // 🔹 Kedvenc csomagpont lekérdezése a backendből
  const fetchFavoritePickupPoint = useCallback(async () => {
    try {
      const data = await getFavoritePickupPoint();
      setFavoritePoint(data || null);
    } catch (error) {
      console.error("❌ Hiba a kedvenc csomagpont lekérdezése során:", error);
    }
  }, []);

  // 🔹 Kedvenc csomagpont mentése a backendbe
  const saveFavorite = async (point: FoxPostPoint) => {
    try {
      await saveFavoritePickupPoint(point);
      setFavoritePoint(null);
      setFavoritePoint(point);
    } catch (error) {
      console.error("❌ Hiba a kedvenc csomagpont mentése során:", error);
    }
  };

  // 🔹 Előző kedvenc pont betöltése (ha van)
  useEffect(() => {
    fetchFavoritePickupPoint();
  }, [fetchFavoritePickupPoint]); // ✅ Már nem okoz végtelen ciklust

  return { favoritePoint, setFavoritePoint, saveFavorite, refetchFavoritePickupPoint: fetchFavoritePickupPoint };
};
