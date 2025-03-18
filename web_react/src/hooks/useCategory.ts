import { useState, useEffect } from "react";
import CategoryService from "../services/CategoryService";

export interface Category {
  id: number;
  name: string;
}

export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        setError("Nem sikerült betölteni a kategóriákat.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Új kategória hozzáadása
  const addCategory = async (name: string) => {
    try {
      const newCategory = await CategoryService.createCategory(name);
      setCategories((prev) => [...prev, newCategory]);
    } catch (err) {
      setError("Nem sikerült létrehozni a kategóriát.");
    }
  };

  // ✅ Kategória módosítása
  const editCategory = async (id: number, name: string) => {
    try {
      const updatedCategory = await CategoryService.updateCategory(id, name);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCategory : cat))
      );
    } catch (err) {
      setError("Nem sikerült módosítani a kategóriát.");
    }
  };

  // ✅ Kategória törlése
  const deleteCategory = async (id: number) => {
    try {
      await CategoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      setError("Nem sikerült törölni a kategóriát.");
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    editCategory,
    deleteCategory,
  };
};
