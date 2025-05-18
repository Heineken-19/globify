import api from "../api";
import { AdminProduct } from "../../types";

class AdminProductService {
  // 🔹 Összes termék lekérdezése (Admin - Minden termék)
  static async getAllProducts(
    page: number = 0,
    size: number = 12,
    category?: string[],
    searchTerm?: string,
    isNew?: boolean,
    isSale?: boolean,
    available?: boolean,
    light?: string[],
    water?: string[],
    type?: string[],
    minMainSize?: number,
    maxMainSize?: number,
    minPrice?: number,
    maxPrice?: number
  ): Promise<{ content: AdminProduct[]; totalPages: number }> {
    const params: Record<string, any> = {
      page,
      size,
    };

    // Dinamikusan hozzáadjuk a szűrőfeltételeket, ha vannak
    if (category) params.category = category;
    if (searchTerm) params.searchTerm = searchTerm;
    if (isNew !== undefined) params.isNew = isNew;
    if (isSale !== undefined) params.isSale = isSale;
    if (available !== undefined) params.available = available;
    if (light) params.light = light;
    if (water) params.water = water;
    if (type) params.type = type;
    if (minMainSize !== undefined) params.minMainSize = minMainSize;
    if (maxMainSize !== undefined) params.maxMainSize = maxMainSize;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;

    const response = await api.get("/api/products/admin", { params });
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
