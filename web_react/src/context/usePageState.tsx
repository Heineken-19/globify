import { createContext, useContext, useState, ReactNode } from "react";

type PageStateContextType = {
  isRegisterPage: boolean;
  setIsRegisterPage: (value: boolean) => void;
};

const PageStateContext = createContext<PageStateContextType | undefined>(undefined);

export const PageStateProvider = ({ children }: { children: ReactNode }) => {
  const [isRegisterPage, setIsRegisterPage] = useState(false);

  return (
    <PageStateContext.Provider value={{ isRegisterPage, setIsRegisterPage }}>
      {children}
    </PageStateContext.Provider>
  );
};

export const usePageState = () => {
  const context = useContext(PageStateContext);
  if (!context) {
    throw new Error("usePageState must be used within a PageStateProvider");
  }
  return context;
};
