import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "./Loader";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If Clerk is configured, prefer Clerk's signed-in state for route protection
  try {
    const clerk = useUser();
    if (clerk && typeof clerk.isLoaded !== "undefined") {
      if (!clerk.isLoaded) return <Loader fullScreen />;
      if (!clerk.isSignedIn)
        return <Navigate to="/login" state={{ from: location }} replace />;
      return children;
    }
  } catch (e) {
    // useUser may throw if ClerkProvider isn't configured; fall back to legacy auth state from AuthContext
  }

  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
