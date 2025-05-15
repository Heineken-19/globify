import api from "./api";

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
  }
  
  export const sendContactMessage = async (data: ContactFormData): Promise<void> => {
    await api.post("/api/contact", data);
  };