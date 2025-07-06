import { Navigate } from "react-router-dom";
import { isTokenValid } from "../lib/utils";
import CookieService from "../services/CookieService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = !!isTokenValid(
    CookieService.getCookie("token") || "",
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
