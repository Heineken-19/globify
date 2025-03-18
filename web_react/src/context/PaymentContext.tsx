import { createContext, useState, useContext } from 'react';

type PaymentContextType = {
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  return (
    <PaymentContext.Provider value={{ selectedPaymentMethod, setSelectedPaymentMethod }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("usePayment must be used within a PaymentProvider");
  return context;
};
