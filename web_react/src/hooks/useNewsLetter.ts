import { useMutation } from "@tanstack/react-query";
import NewsletterService from "../services/NewsletterService";
import { useNotification } from "../context/NotificationContext";

export function useSubscribeToNewsletter() {
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: (email: string) => NewsletterService.subscribe(email),
    onSuccess: (res) => {
      showSuccess(res.data);
    },
    onError: (err: any) => {
      showError(err.response?.data || "Ismeretlen hiba");
    },
  });
}

export function useUnsubscribeFromNewsletter() {
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: (email: string) => NewsletterService.unsubscribe(email),
    onSuccess: (res) => {
      showSuccess(res.data);
    },
    onError: (err: any) => {
      showError(err.response?.data || "Ismeretlen hiba");
    },
  });
}

export function useUnsubscribeByToken() {
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: (token: string) => NewsletterService.unsubscribeByToken(token),
    onSuccess: () => {
      showSuccess("Sikeresen leiratkoztál a hírlevélről!");
    },
    onError: () => {
      showError("Érvénytelen vagy lejárt leiratkozási link.");
    },
  });
}
