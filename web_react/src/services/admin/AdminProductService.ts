import api from "../api";
import { AdminProduct } from "../../types";

class AdminProductService {
  // 🔹 Összes termék lekérdezése
  static async getAllProducts(page: number = 0, size: number = 12): Promise<{ content: AdminProduct[], totalPages: number }> {
    const response = await api.get(`/api/products?page=${page}&size=${size}`);
    return response.data;
  }

  // 🔹 Egyedi termék lekérdezése
  static async getProductById(id: number): Promise<AdminProduct> {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  }

  // 🔹 Új termék létrehozása
  static async createProduct(product: FormData): Promise<AdminProduct> {
    const response = await api.post("/api/products", product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // 🔹 Termék frissítése
  static async updateProduct({ id, product }: { id: number; product: FormData }) {
    if (!id) {
      console.error("Hiba: Az id nem lehet undefined.");
      return;
    }
    return api.put(`/api/products/${id}`, product, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
  }

  // 🔹 Termék törlése
  static async deleteProduct(id: number): Promise<void> {
    await api.delete(`/api/products/${id}`);
  }

    // 🔹 Összes kategória lekérése
    static async getCategories(): Promise<{ id: number; name: string }[]> {
      const response = await api.get("/api/categories");
      return response.data;
    }
  
    // 🔹 Új kategória létrehozása
    static async createCategory(categoryName: string): Promise<{ id: number; name: string }> {
      const response = await api.post("/api/categories", { name: categoryName });
      return response.data;
    }
  }

export default AdminProductService;
