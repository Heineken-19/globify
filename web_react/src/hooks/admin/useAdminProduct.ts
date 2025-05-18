import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import AdminProductService from "../../services/admin/AdminProductService";
import { AdminProduct } from "../../types";

// 🔹 Admin termékek listázása (szűrhető)
export const useAdminProducts = (
  page: number = 0,
  size: number = 12,
  category?: string[],
  searchTerm?: string,
  isNew?: boolean,
  isSale?: boolean,
  available?: boolean,
  light?: string[],
  water?: string[],
  type?: string[],
  minMainSize?: number,
  maxMainSize?: number,
  minPrice?: number,
  maxPrice?: number
) => {
  return useQuery<{ content: AdminProduct[]; totalPages: number }, Error>({
    queryKey: [
      "adminProducts",
      page,
      size,
      category,
      searchTerm,
      isNew,
      isSale,
      available,
      light,
      water,
      type,
      minMainSize,
      maxMainSize,
      minPrice,
      maxPrice,
    ],
    queryFn: () =>
      AdminProductService.getAllProducts(
        page,
        size,
        category,
        searchTerm,
        isNew,
        isSale,
        available,
        light,
        water,
        type,
        minMainSize,
        maxMainSize,
        minPrice,
        maxPrice
      ),
    gcTime: 1000 * 60 * 10, // ✅ 10 percig a cache-ben marad (Garbage Collection)
    staleTime: 1000 * 60 * 5, // ✅ 5 percig friss
    refetchOnWindowFocus: false, // 🔧 Csak manuálisan vagy változásra frissít
  });
};

// 🔹 Egyedi termék lekérdezése
export const useAdminProduct = (id: number) => {
  return useQuery<AdminProduct, Error>({
    queryKey: ["adminProduct", id],
    queryFn: () => AdminProductService.getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // ✅ 5 percig friss
  });
};

// 🔹 Új termék létrehozása
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AdminProductService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
  });
};

// 🔹 Termék frissítése
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: number; product: FormData }) =>
      AdminProductService.updateProduct({ id, product }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["adminProduct", id] });
    },
  });
};

// 🔹 Termék törlése
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AdminProductService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
  });
};

// 🔹 Összes kategória lekérése
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: AdminProductService.getCategories,
    staleTime: 1000 * 60 * 5, // ✅ 5 percig friss
  });
};

// 🔹 Új kategória létrehozása
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AdminProductService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
