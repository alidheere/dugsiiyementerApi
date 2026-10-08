import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";

import api from "../../lib/api/apiClient";
import { extractErrorMesage } from "../../util/errUtiuls";
import useAuthStore from "../../lib/store/authStore";

const LoginForm = () => {
  const navigate = useNavigate();

  const { setAuth } = useAuthStore();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post(
        "/auth/login",
        credentials
      );

      return response.data;
    },

    onSuccess: (data) => {

      if (data.token) {
        const user = data.user;
        const token = data.token;

        setAuth(user, token);

        navigate("/dashboard");
      }
    },

    onError: (err) => {
      console.error("LOGIN ERROR:", err);

      setError(extractErrorMesage(err));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);

    if (!formValues.email || !formValues.password) {
      setError("All fields are required");
      return;
    }

    loginMutation.mutate({
      email: formValues.email,
      password: formValues.password,
    });
  };

  return (
    <Card className="w-full border-border">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-center">
          Sign in
        </CardTitle>

        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-left">
              Email
            </div>

            <Input
              name="email"
              type="email"
              placeholder="osman@gmail.com"
              required
              value={formValues.email}
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-left">
              Password
            </div>

            <Input
              name="password"
              type="password"
              placeholder="****"
              required
              value={formValues.password}
              onChange={handleChange}
            />
          </div>

          {/* BUTTON */}
          <div className="py-4">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login Account"
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pt-0">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-primary hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;