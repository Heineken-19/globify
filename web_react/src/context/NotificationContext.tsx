import { createContext, useContext, ReactNode, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  const showSuccess = (message: string) => {
    const index = notificationCount;
    setNotificationCount((prev) => prev + 1);

    showNotification({
      title: "Siker!",
      message,
      color: "green",
      icon: <IconCheck size={18} />,
      autoClose: 2000,
      styles: {
        root: {
          position: "fixed",
          top: `calc(8% + ${index * 70}px)`,
          right: "20px",
          transform: "translateY(-50%)",
          zIndex: 9999,
          width: "320px", // ✅ Fix szélesség
          minHeight: "60px", // ✅ Magasság kijelentkezéshez is
          padding: "14px", // ✅ Extra padding
          borderRadius: "8px",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap", // ✅ Szöveg ne törjön meg
        },
      },
      onClose: () => setNotificationCount((prev) => prev - 1),
    });
  };

  const showError = (message: string) => {
    const index = notificationCount;
    setNotificationCount((prev) => prev + 1);

    showNotification({
      title: "Hiba!",
      message,
      color: "red",
      icon: <IconX size={18} />,
      autoClose: 3000,
      styles: {
        root: {
          position: "fixed",
          top: `calc(8% + ${index * 70}px)`,
          right: "20px",
          transform: "translateY(-50%)",
          zIndex: 9999,
          width: "320px", // ✅ Fix szélesség
          minHeight: "60px", // ✅ Magasság kijelentkezéshez is
          padding: "14px", // ✅ Extra padding
          borderRadius: "8px",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap", // ✅ Szöveg ne törjön meg
        },
      },
      onClose: () => setNotificationCount((prev) => prev - 1),
    });
  };

  const showInfo = (message: string) => {
    const index = notificationCount;
    setNotificationCount((prev) => prev + 1);

    showNotification({
      title: "Információ",
      message,
      color: "blue",
      icon: <IconInfoCircle size={18} />,
      autoClose: 3000,
      styles: {
        root: {
          position: "fixed",
          top: `calc(8% + ${index * 70}px)`,
          right: "20px",
          transform: "translateY(-50%)",
          zIndex: 9999,
          width: "320px", // ✅ Fix szélesség
          minHeight: "60px", // ✅ Magasság kijelentkezéshez is
          padding: "14px", // ✅ Extra padding
          borderRadius: "8px",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap", // ✅ Szöveg ne törjön meg
        },
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
