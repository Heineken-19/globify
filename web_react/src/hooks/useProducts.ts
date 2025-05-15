import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, ProductPage } from "../types";
import {
  getProducts,
  getProductById,
  getRecommendedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getNewProducts
} from "../services/ProductService";
import { ProductFilters } from "./useProductFilters";

interface UseProductsProps {
  category?: string;
  searchTerm?: string;
  page?: number;
  size?: number;
  filters?: ProductFilters;
  isNew?: boolean;
  isSale?: boolean;
  isPopular?: boolean;
}

export const useProducts = ({
  category,
  searchTerm,
  page = 0,
  size = 12,
  filters,
  isNew,
  isSale,
  isPopular,
}: UseProductsProps) => {
  return useQuery<ProductPage>({
    queryKey: ["products", category, searchTerm, page, size, filters, isNew, isSale, isPopular],
    queryFn: () => getProducts(category, searchTerm, page, size, filters, isNew, isSale, isPopular),
  });
};


// 🔹 Egy termék lekérdezése
export const useProduct = (productId: number | null) => {
  return useQuery<Product, Error>({
    queryKey: ["product", productId],
    queryFn: () => {
      if (!productId) throw new Error("Termék ID szükséges");
      return getProductById(productId);
    },
    enabled: !!productId, // Csak akkor futtatja a kérést, ha van ID
  });
};

// 🔹 Ajánlott termékek lekérdezése
export const useRecommendedProducts = (productId: number) => {
  return useQuery({
    queryKey: ["recommendedProducts", productId],
    queryFn: () => getRecommendedProducts(productId),
    enabled: !!productId,
  });
};

// 🔹 Termék létrehozása
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// 🔹 Termék frissítése
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, productData }: { id: number; productData: any }) => updateProduct(id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// 🔹 Termék törlése
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};  

export const useNewProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["new-products"],
    queryFn: getNewProducts,
  });
};

