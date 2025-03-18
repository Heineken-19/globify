import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "../types";
import { useNotification } from "./NotificationContext";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const { showSuccess,  showInfo } = useNotification();

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Hiba a kosár mentésekor:", error);
    }
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    showSuccess(`${product.name} sikeresen hozzáadva a kosárhoz.`);
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Azonnali mentés törlés után
      return updatedCart;
    });
    showSuccess("Termék eltávolítva a kosárból!");
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      quantity > 0
        ? prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
        : prevCart.filter((item) => item.id !== id) // Ha 0, akkor töröljük
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    showInfo("A kosár törölve lett!");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
