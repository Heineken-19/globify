import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminProductService from "../../services/admin/AdminProductService";
import { AdminProduct } from "../../types";

export const useAdminProducts = () => {
  return useQuery<AdminProduct[], Error>({
    queryKey: ["adminProducts"],
    queryFn: AdminProductService.getAllProducts,
  });
};

export const useAdminProduct = (id: number) => {
  return useQuery<AdminProduct, Error>({
    queryKey: ["adminProduct", id],
    queryFn: () => AdminProductService.getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AdminProductService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] }); // ✅ Javítva
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: number; product: FormData }) =>
      AdminProductService.updateProduct({ id, product }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] }); // ✅ Javítva
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AdminProductService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] }); // ✅ Javítva
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: AdminProductService.getCategories,
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
