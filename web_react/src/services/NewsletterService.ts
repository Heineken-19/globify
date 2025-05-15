import api from "./api";

class NewsletterService {
  subscribe(email: string) {
    return api.post("/api/newsletter/subscribe", null, {
      params: { email },
    });
  }

  unsubscribe(email: string) {
    return api.post("/api/newsletter/unsubscribe", null, {
      params: { email },
    });
  }

  unsubscribeByToken(token: string) {
    return api.get(`/api/newsletter/unsubscribe`, {
      params: { token },
    });
  }

  send(subject: string, message: string) {
    return api.post("/api/newsletter/send", { subject, message });
  }
}

export default new NewsletterService();
