import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminDiscountService } from "../../services/admin/AdminDiscountService";

export const useAdminDiscounts = () => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["admin-sale-products"],
    queryFn: AdminDiscountService.getSaleProducts,
  });

  const updateDiscountMutation = useMutation({
    mutationFn: ({ productId, discount }: { productId: number; discount: number }) =>
      AdminDiscountService.updateDiscount(productId, discount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sale-products"] });
    },
  });

  return {
    productsQuery,
    updateDiscountMutation,
  };
};
