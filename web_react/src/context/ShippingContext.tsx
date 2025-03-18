import { createContext, useState, useContext } from 'react';

type ShippingContextType = {
  selectedShippingMethod: string;
  setSelectedShippingMethod: (method: string) => void;
  selectedShippingPoint: string | null;
  setSelectedShippingPoint: (point: string | null) => void;
};

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

export const ShippingProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("");
  const [selectedShippingPoint, setSelectedShippingPoint] = useState<string | null>(null);

  return (
    <ShippingContext.Provider value={{
      selectedShippingMethod,
      setSelectedShippingMethod,
      selectedShippingPoint,
      setSelectedShippingPoint
    }}>
      {children}
    </ShippingContext.Provider>
  );
};

export const useShipping = () => {
  const context = useContext(ShippingContext);
  if (!context) throw new Error("useShipping must be used within a ShippingProvider");
  return context;
};
