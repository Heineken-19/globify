import api from "./api";
import { Product } from "../types";

// 🔹 Összes termék lekérdezése
export const getProducts = async (category?: string, searchTerm?: string): Promise<Product[]> => {
  const params: any = {};

  if (category) {
    params.category = category;
  }

  if (searchTerm) {
    params.searchTerm = searchTerm;
  }

  const response = await api.get("/api/products", { params });
  return response.data;
};

// 🔹 Egyedi termék lekérdezése
export const getProductById = async (id: number) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

// 🔹 Ajánlott termékek lekérdezése
export const getRecommendedProducts = async (productId: number) => {
  const response = await api.get(`/api/products/${productId}/recommendations`);
  return response.data;
};

// 🔹 Új termék létrehozása
export const createProduct = async (productData: any) => {
  const response = await api.post("/api/products", productData);
  return response.data;
};

// 🔹 Termék frissítése
export const updateProduct = async (id: number, productData: any) => {
  const response = await api.put(`/api/products/${id}`, productData);
  return response.data;
};

// 🔹 Termék törlése
export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};
