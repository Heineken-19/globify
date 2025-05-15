import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { Subscriber } from "../../types";

export const useNewsletterSubscribers = () => {
  return useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async () => {
      const res = await api.get<Subscriber[]>("/api/newsletter/subscribers");
      return res.data;
    },
  });
};
