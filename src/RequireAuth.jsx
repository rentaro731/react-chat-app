import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "./UserContext";
import { auth } from "./firebaseConfig";

export const RequireAuth = ({ children }) => {
  const location = useLocation();
  const { loading } = useUserContext();

  if (loading) return <div>Loading...</div>;
  if (!auth.currentUser) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }
  return children;
};
