import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  getRecommendedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/ProductService";
import { Product } from "../types";

export const useProducts = (category?: string, searchTerm?: string) => {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products", category, searchTerm],
    queryFn: () => getProducts(category, searchTerm),
  });

  // 🔹 Kosárhoz adás funkció (helyi state vagy context később)
  const addToCart = (product: Product) => {
    console.log("Hozzáadva a kosárhoz:", product);
    // Itt lehet például a kosár context-be tenni az elemet
  };

  return { products: products || [], isLoading, error, addToCart };
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

