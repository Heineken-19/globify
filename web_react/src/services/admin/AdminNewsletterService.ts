import api from "../api";

export interface NewsletterTemplate {
  id: number;
  subject: string;
  message: string;
  imageUrls: string[] | string;
  createdAt: string;
}

class AdminNewsletterService {
  getTemplates() {
    return api.get<NewsletterTemplate[]>("/api/newsletter/templates");
  }

  createTemplate(subject: string, message: string, imageUrls: string[] = []) {
    return api.post<NewsletterTemplate>("/api/newsletter/templates", { subject, message, imageUrls });
  }

  deleteTemplate(id: number) {
    return api.delete(`/api/newsletter/templates/${id}`);
  }

  sendNewsletter(id: number) {
    return api.post(`/api/newsletter/templates/${id}/send`);
  }

  updateTemplate(id: number, data: Partial<{ subject: string; message: string }>) {
    return api.put(`/newsletter/templates/${id}`, data);
  }
}

export default new AdminNewsletterService();
