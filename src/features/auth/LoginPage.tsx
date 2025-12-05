import React, { useState } from "react";
import { AuthLayout } from "./components/AuthLayout";
import { Button } from "../../components/common/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin, getAuthError } from "@/api";
import {
  Eye,
  EyeOff,
  Facebook,
  Chrome,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { useLanguage } from "../../contexts/LanguageContext";
import { SEO } from "@/components/common/SEO";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  // Get the intended destination from ProtectedRoute or default to home
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  // Form Hooks
  const { register, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Manual validation for Alert
    if (!data.email || !data.password) {
      setError(t("auth.login.error.missingFields"));
      return;
    }
    setError(null);

    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          navigate(from, { replace: true });
        },
        onError: (error) => {
          console.error("Login failed", error);
          setError(getAuthError(error) || t("auth.login.error.generic"));
        },
      }
    );
  };

  return (
    <AuthLayout
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
    >
      <SEO
        title="Sign In"
        description="Welcome back! Sign in to your Coffee & Co account to access your rewards, order history, and saved favorites."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Validation Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.login.emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">{t("auth.login.passwordLabel")}</Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-coffee-500 dark:text-coffee-400 hover:text-coffee-800 dark:hover:text-coffee-200 transition-colors"
            >
              {t("auth.login.forgotPassword")}
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              className="pr-12"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400 dark:text-coffee-500 hover:text-coffee-600 dark:hover:text-coffee-300 focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          size="lg"
          type="submit"
          disabled={loginMutation.isPending}
          className="!rounded-xl h-12 mt-4 font-bold"
        >
          {loginMutation.isPending ? t("auth.login.submitting") : t("auth.login.submit")}
        </Button>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-coffee-100 dark:border-coffee-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-coffee-950 px-4 text-coffee-400 dark:text-coffee-500 tracking-wider">
              {t("auth.login.or")}
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            className="flex items-center justify-center h-12 bg-cream-100 dark:bg-coffee-800 hover:bg-cream-200 dark:hover:bg-coffee-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-coffee-400 focus:ring-offset-2"
            aria-label="Sign in with Phone"
          >
            <Smartphone
              className="w-5 h-5 text-coffee-700 dark:text-coffee-200"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="flex items-center justify-center h-12 bg-cream-100 dark:bg-coffee-800 hover:bg-cream-200 dark:hover:bg-coffee-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-coffee-400 focus:ring-offset-2"
            aria-label="Sign in with Google"
          >
            <Chrome
              className="w-5 h-5 text-red-500 dark:text-red-400"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="flex items-center justify-center h-12 bg-cream-100 dark:bg-coffee-800 hover:bg-cream-200 dark:hover:bg-coffee-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-coffee-400 focus:ring-offset-2"
            aria-label="Sign in with Facebook"
          >
            <Facebook
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
          </button>
        </div>

        <p className="text-center text-sm text-coffee-500 dark:text-coffee-400 pt-4">
          {t("auth.login.noAccount")}{" "}
          <Link
            to="/register"
            className="font-bold text-coffee-900 dark:text-white hover:underline"
          >
            {t("auth.login.register")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
