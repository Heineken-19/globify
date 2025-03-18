import api from "./api";
import { Product } from "../types";

const FavoriteService = {
  getFavorites: async (userId: number): Promise<Product[]>=>{ 
    try {
      const response = await api.get<Product[]>(`/api/favorites/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Hiba a kedvencek lekérésekor:", error);
      return [];
    }
  },

  addFavorite: async (userId: number, productId: number) => {
    try {
      const response = await api.post(`/api/favorites/${userId}/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Hiba a kedvencekhez adáskor:", error);
      throw new Error("Nem sikerült hozzáadni a kedvencekhez.");
    }
  },

  removeFavorite: async (userId: number, productId: number) => {
    try {
      const response = await api.delete(`/api/favorites/${userId}/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Hiba a kedvencekből törléskor:", error);
      throw new Error("Nem sikerült eltávolítani a kedvencek közül.");
    }
  },
};


export default FavoriteService;
