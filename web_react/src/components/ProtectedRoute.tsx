import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { token, userRole } = useAuth();

  if (!token) {
    // ✅ Ha nincs token, irányítsuk a login oldalra
    return <Navigate to="/" replace />;
  }

  if (adminOnly && userRole !== "ADMIN") {
    // ✅ Ha nincs admin jogosultság, irányítsuk az /unauthorized oldalra
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
