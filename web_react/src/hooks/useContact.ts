import { useMutation } from "@tanstack/react-query";
import { ContactFormData, sendContactMessage } from "../services/ContactService";

export const useContact = () => {
  return useMutation<void, Error, ContactFormData>({
    mutationFn: sendContactMessage,
  });
};