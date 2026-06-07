import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

const AdminRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  // Check if authenticated and is_admin flag is true
  if (!user || !profile?.is_admin) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default AdminRoute;
