import { useQuery } from "@tanstack/react-query";
import api from "../..//services/api";

export const useNewsletterStats = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6); // utolsó 7 nap

  const start = startDate.toISOString().split("T")[0];
  const end = endDate.toISOString().split("T")[0];

  return useQuery({
    queryKey: ["newsletterStats", start, end],
    queryFn: async () => {
      const res = await api.get("/api/admin/newsletter-subscriptions", {
        params: { startDate: start, endDate: end },
      });
      return res.data; // [{ date: "2025-04-17", subscriptions: 5 }, ...]
    },
  });
};
