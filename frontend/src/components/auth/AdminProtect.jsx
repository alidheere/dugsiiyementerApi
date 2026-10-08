import { useEffect } from "react";
import useAuthStore from "../../lib/store/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api/apiClient";
import { Navigate, useLocation } from "react-router";
import { Loader } from "lucide-react";

const AdminProtect = ({ children }) => {
  const location = useLocation();

  const {
    user,
    token,
    clearAuth,
    setAuth,
  } = useAuthStore();

  const {
    data,
    error,
    isLoading,
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
  });

  // Haddii authentication-ku fashilmo
  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError, clearAuth]);

  // User-ka ku kaydi Zustand
  useEffect(() => {
    if (isSuccess && data) {
      setAuth(data, token);
    }
  }, [isSuccess, data, token, setAuth]);

  // Loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }
  console.log("TOKEN:", token);
console.log("LOADING:", isLoading);
console.log("SUCCESS:", isSuccess);
console.log("ERROR:", error);
console.log("DATA:", data);
console.log("USER:", user);

  // Token/authentication invalid
  if (isError) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

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

  // Haddii user weli uusan jirin
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  // User ma aha admin
  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2>Nice try 😄. This page is only for admins.</h2>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtect;