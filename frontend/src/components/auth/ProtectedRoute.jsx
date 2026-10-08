import { useEffect } from "react";
import useAuthStore from "../../lib/store/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api/apiClient";
import { Navigate, useLocation } from "react-router";
import { Loader } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const {
    user,
    token,
    clearAuth,
    setAuth,
  } = useAuthStore();

  const {
    data,
    isPending,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["current-user"],

    queryFn: async () => {
      const response = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },

    enabled: !!token,
    retry: false,
  });

  // Profile request error
  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError, clearAuth]);

  // Profile successfully loaded
  useEffect(() => {
    if (isSuccess && data) {
      console.log("PROFILE DATA:", data);

      const currentUser = data.user ?? data;

      setAuth(currentUser, token);
    }
  }, [isSuccess, data, token, setAuth]);

  // No token
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Loading
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Request failed
  if (isError) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // User not available yet
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;