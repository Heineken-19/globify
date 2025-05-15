import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminNewsletterService from "../../services/admin/AdminNewsletterService";
import { useNotification } from "../../context/NotificationContext";

export function useNewsletterTemplates() {
  return useQuery({
    queryKey: ["newsletter-templates"],
    queryFn: () => AdminNewsletterService.getTemplates().then(res => res.data),
  });
}

export function useCreateNewsletterTemplate() {
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subject, message, imageUrls }: { subject: string; message: string; imageUrls?: string[] }) =>
      AdminNewsletterService.createTemplate(subject, message, imageUrls ?? []),
    onSuccess: () => {
      showSuccess("Hírlevél sablon sikeresen létrehozva.");
      queryClient.invalidateQueries({ queryKey: ["newsletter-templates"] });
    },
    onError: () => {
      showError("Nem sikerült létrehozni a sablont.");
    },
  });
}

export function useUpdateNewsletterTemplate() {
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<{ subject: string; message: string; imageUrls?: string[]; }> }) =>
      AdminNewsletterService.updateTemplate(id, data),
    onSuccess: () => {
      showSuccess("Sablon sikeresen frissítve.");
      queryClient.invalidateQueries({ queryKey: ["newsletter-templates"] });
    },
    onError: () => {
      showError("Nem sikerült frissíteni a sablont.");
    },
  });
}

export function useDeleteNewsletterTemplate() {
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => AdminNewsletterService.deleteTemplate(id),
    onSuccess: () => {
      showSuccess("Sablon törölve.");
      queryClient.invalidateQueries({ queryKey: ["newsletter-templates"] });
    },
    onError: () => {
      showError("Nem sikerült törölni a sablont.");
    },
  });
}

export function useSendNewsletterTemplate() {
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: (id: number) => AdminNewsletterService.sendNewsletter(id),
    onSuccess: () => {
      showSuccess("Hírlevél kiküldve!");
    },
    onError: () => {
      showError("Nem sikerült elküldeni a hírlevelet.");
    },
  });
}
