import { useState, useEffect } from "react";
import OrderService from "../services/OrderService";
import { OrderData, OrderRequestDTO } from "../types";

const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);

  const createOrder = async (orderData: OrderRequestDTO) => {
    if (!orderData.items || orderData.items.length === 0) {
      console.error("HIBA: A rendelési adatok 'items' mezője üres vagy nincs meghatározva!");
      return;
    }
    setLoading(true);
    try {
      const response = await OrderService.createOrder(orderData);
      console.log("Rendelési válasz:", response);

      const orderId = response.id;
      if (!orderId) {
        console.error("HIBA: A rendelési azonosító nem található a válaszban!");
        return;
      }
      
      console.log("Rendelés sikeresen létrehozva, orderId:", orderId);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Hiba történt a rendelés során.");
      }
    } finally {
      setLoading(false);
    }
    };
  
    const fetchUserOrders = async (page: number = 0, size: number = 10) => {
      setLoading(true);
      try {
        const data = await OrderService.getUserOrders(page, size);
        setOrders(data);
      } catch (err: unknown) {
        setError("Nem sikerült lekérni a rendeléseket.");
      } finally {
        setLoading(false);
      }
    };
  
    /**
     * 🔹 Egy rendelés lekérése ID alapján
     */
    const getOrderById = async (orderId: number) => {
      setLoading(true);
      try {
        const order = await OrderService.getOrderById(orderId);
        return order;
      } catch (err: unknown) {
        setError("Nem sikerült lekérni a rendelést.");
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    /**
     * 🔹 Rendelés törlése (ha még nem teljesített)
     */
    const cancelOrder = async (orderId: number) => {
      setLoading(true);
      try {
        await OrderService.cancelOrder(orderId);
        // Frissítjük a rendeléseket
        fetchUserOrders();
      } catch (err: unknown) {
        setError("Nem sikerült törölni a rendelést.");
      } finally {
        setLoading(false);
      }
    };
    
  
    useEffect(() => {
      fetchUserOrders(); // Automatikusan lekérjük a rendeléseket betöltéskor
    }, []);

  return { createOrder, fetchUserOrders, getOrderById, cancelOrder, orders, loading, error };
};

export default useOrder;