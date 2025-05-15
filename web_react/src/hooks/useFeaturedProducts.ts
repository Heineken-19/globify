import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { ProductPage } from "../types";

export function useSaleProducts() {
  return useQuery({
    queryKey: ["saleProducts"],
    queryFn: async () => {
      const res = await api.get<ProductPage>("/api/products", {
        params: {
          isSale: true,
          available: true,
          size: 50, // 🔄 lekérdezzük az összeset (vagy amennyit gondolsz)
          page: 0,
        },
      });
      return res.data.content;
    },
  });
}

export function usePopularProducts() {
  return useQuery({
    queryKey: ["popularProducts"],
    queryFn: async () => {
      const res = await api.get<ProductPage>("/api/products", {
        params: {
          isPopular: true,
          available: true,
          size: 50, // vagy akár 10
          page: 0,
        },
      });
      return res.data.content;
    },
  });
}
