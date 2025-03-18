import api from "./api";

const CategoryService = {
  // 🔹 Összes kategória lekérése
  getAllCategories: async () => {
    const response = await api.get("/api/categories");
    return response.data;
  },

  // 🔹 Kategória lekérése ID alapján
  getCategoryById: async (id: number) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  // 🔹 Új kategória létrehozása
  createCategory: async (name: string) => {
    const response = await api.post("/api/categories", { name });
    return response.data;
  },

  // 🔹 Kategória módosítása
  updateCategory: async (id: number, name: string) => {
    const response = await api.put(`/api/categories/${id}`, { name });
    return response.data;
  },

  // 🔹 Kategória törlése
  deleteCategory: async (id: number) => {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },
};

export default CategoryService;
