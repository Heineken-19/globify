import { createContext, useContext, ReactNode, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const getNotificationStyle = (index: number): React.CSSProperties => ({
    position: "fixed",
    top: isMobile ? `${30 + index * 55}px` : `calc(8% + ${index * 70}px)`,
    left: "50%",
    right: isMobile ? "auto" : "20px",
    transform: isMobile ? "translateX(-50%)" : "translateY(-50%)",
    zIndex: 9999,
    width: isMobile ? "250px" : "350px",
    minHeight: isMobile ? "38px" : "50px",
    padding: isMobile ? "6px 10px" : "10px 16px",
    borderRadius: "8px",
    boxSizing: "border-box",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    fontSize: isMobile ? "12px" : "14px", 
    fontWeight: 500,
    animation: "slideDown 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards"
  });

  const showSuccess = (message: string) => {
    const index = notificationCount;
    setNotificationCount((prev) => prev + 1);

    showNotification({
      message,
      color: "green",
      icon: <IconCheck size={8} />,
      autoClose: 2000,
      styles: {
        root: getNotificationStyle(index),
      },
      onClose: () => setNotificationCount((prev) => prev - 1),
    });
  };

  const showError = (message: string) => {
    const index = notificationCount;
    setNotificationCount((prev) => prev + 1);

    showNotification({
      message,
      color: "red",
      icon: <IconX size={8} />,
      autoClose: 3000,
      styles: {
        root: getNotificationStyle(index),
      },
      onClose: () => setNotificationCount((prev) => prev - 1),
    });
  };

  const showInfo = (message: string) => {
    const index = notificationCount;
    setNotificationCount((prev) => prev + 1);

    showNotification({
      message,
      color: "blue",
      icon: <IconInfoCircle size={8} />,
      autoClose: 3000,
      styles: {
        root: getNotificationStyle(index),
      },
      onClose: () => setNotificationCount((prev) => prev - 1),
    });
  };

  

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

