import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../utils/auth";
import { apiClient } from "../utils/apiClient";

interface AuthGuardProps {
  children: ReactNode;
}

const SKIP_BACKEND_VERIFICATION = true; // Set to false when backend is ready

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!auth.isAuthenticated()) {
        setIsVerifying(false);
        setIsValid(false);
        return;
      }

      // In development mode, skip backend verification
      if (SKIP_BACKEND_VERIFICATION) {
        setIsValid(true);
        setIsVerifying(false);
        return;
      }

      // Production: verify with backend
      try {
        await apiClient.verifyToken();
        setIsValid(true);
      } catch (error) {
        console.error("Token verification failed:", error);
        auth.removeToken();
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, []);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
