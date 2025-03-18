import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import FavoriteService from "../services/FavoriteService";
import { Product, FavoriteContextType } from "../types";
import { useNotification } from "./NotificationContext";

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const userId = Number(localStorage.getItem("user_id"));
  const [favorites, setFavorites] = useState<Product[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 🔹 Hozzáadva az error állapot
  const { showSuccess, showError } = useNotification();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FavoriteService.getFavorites(userId);
      setFavorites([...data]);
    } catch (err) {
      setError("Nem sikerült betölteni a kedvenceket.");
      showError("Nem sikerült betölteni a kedvenceket."); // ✅ Hozzáadjuk az értesítést
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
      await fetchFavorites();

      // ✅ Helyettesítjük a belső notification-t
      showSuccess(`${product.name} sikeresen hozzáadva a kedvencekhez.`);
    } catch (error) {
      setError("Nem sikerült hozzáadni a kedvencekhez.");
      showError("Nem sikerült hozzáadni a kedvencekhez."); // ✅ Helyettesítés
      console.error("Hiba történt a kedvencekhez adáskor:", error);
    }
  };

  const removeFavorite = async (productId: number) => {
    try {
      await FavoriteService.removeFavorite(userId, productId);
      await fetchFavorites();

      // ✅ Helyettesítjük a belső notification-t
      showSuccess("Termék eltávolítva a kedvencek közül.");
    } catch (error) {
      setError("Nem sikerült eltávolítani a kedvencekből.");
      showError("Nem sikerült eltávolítani a kedvencekből."); // ✅ Helyettesítés
      console.error("Hiba történt a kedvencek eltávolításakor:", error);
    }
  };
  
  return (
    <FavoriteContext.Provider value={{ favorites, loading, error, addFavorite, removeFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return context;
};
