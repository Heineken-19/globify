import api from "./api";
import qs from "qs";
import { Product, ProductPage } from "../types";
import { ProductFilters } from "../hooks/useProductFilters";

// 🔹 Összes termék lekérdezése
export const getProducts = async (
  category?: string,
  searchTerm?: string,
  page: number = 0,
  size: number = 12,
  filters?: ProductFilters,
  isNew?: boolean,
  isSale?: boolean,
  isPopular?: boolean
): Promise<ProductPage> => {
  const params: any = {
    page,
    size,
  };

  if (category && category !== "new" && category !== "sale") {
    params.category = category;
  }

  if (searchTerm) {
    params.searchTerm = searchTerm;
  }

  if (isNew !== undefined) params.isNew = isNew;
  if (isSale !== undefined) params.isSale = isSale;
  if (isPopular !== undefined) params.isPopular = isPopular;

  if (filters) {
    if (filters.light) params.light = filters.light;
    if (filters.water) params.water = filters.water;
    if (filters.type) params.type = filters.type;
    
    if (filters.categories && filters.categories.length > 0) {
      params.category = filters.categories;
    }
    if (filters.minPrice != null) params.minPrice = filters.minPrice;
    if (filters.maxPrice != null) params.maxPrice = filters.maxPrice;

    if (filters.sizeRange != null) {
      params.minMainSize = filters.sizeRange[0];
      params.maxMainSize = filters.sizeRange[1];
    }
  }

  const response = await api.get("/api/products", {
    params,
    paramsSerializer: params => qs.stringify(params, { indices: false })
  });
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

export const getNewProducts = async (): Promise<Product[]> => {
  const response = await api.get("/api/products/new");
  return response.data;
};
