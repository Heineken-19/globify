import api from "../api";
import { Product } from "../../types";

export const AdminDiscountService = {
  getSaleProducts: async (): Promise<Product[]> => {
    const response = await api.get("/api/products?isSale=true&page=0&size=100");
    return response.data.content;
  },

  updateDiscount: async (productId: number, discountPercentage: number) => {
    const formData = new FormData();
    formData.append("product", JSON.stringify({
      discountPercentage,       // ✅ csak ez megy, más nem!
      isSale: true,               // ✅ fontos: legyen akciós!
    }));
  
    return api.put(`/api/products/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
};
