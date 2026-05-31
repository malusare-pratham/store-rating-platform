import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const redirectMap = { admin: "/admin", user: "/dashboard", store_owner: "/owner" };
    return <Navigate to={redirectMap[user?.role] || "/login"} replace />;
  }
  return children;
};

export default ProtectedRoute;
