import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "./UserContext";

export const RequireAuth = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useUserContext();

  if (loading) return <div>Loading...</div>;
  if (!user?.uid) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }
  return children;
};
