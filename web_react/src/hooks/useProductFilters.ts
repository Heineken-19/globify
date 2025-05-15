import { useState } from "react";

export type ProductFilters = {
  light: string[] | null;
  water: string[] | null;
  type: string[] | null;
  categories: string[] | null;
  minPrice: number | null;
  maxPrice: number | null;
  sizeRange: [number, number] | null;
};
  
  export const useProductFilters = () => {
    const [filters, setFilters] = useState<ProductFilters>({
      light: null,
      water: null,
      type: null,
      categories: null,
      minPrice: null,
      maxPrice: null,
      sizeRange: null,
    });
  
    const clearFilter = (key: keyof ProductFilters) => {
      setFilters((prev) => ({ ...prev, [key]: key === "sizeRange" ? null : null }));
    };
  
    return { filters, setFilters, clearFilter };
  };
  