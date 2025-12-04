import React from "react";
import { AuthLayout } from "./components/AuthLayout";
import { Button } from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "./store";
import { ArrowLeft, Mail, AlertCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "../../utils/cn";
import { useLanguage } from "../../contexts/LanguageContext";

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const requestReset = useAuthStore((state) => state.requestPasswordReset);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { t } = useLanguage();

  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, t("auth.register.validation.emailRequired"))
      .email(t("auth.register.validation.emailInvalid")),
  });

  type FormValues = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await requestReset(data.email);
      // UX Best Practice: Always show success even if email doesn't exist to prevent enumeration
      toast.success(t("auth.forgotPassword.success.title"), {
        description: t("auth.forgotPassword.success.desc"),
      });
      navigate("/verify-otp");
    } catch (error) {
      toast.error(t("auth.forgotPassword.error"));
    }
  };

  return (
    <AuthLayout
      title={t("auth.forgotPassword.title")}
      subtitle={t("auth.forgotPassword.subtitle")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className={errors.email ? "text-error" : ""}>
            {t("auth.forgotPassword.emailLabel")}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
            <Input
              id="email"
              type="email"
              placeholder={t("auth.forgotPassword.emailPlaceholder")}
              className={cn(
                "pl-10",
                errors.email && "border-error focus-visible:ring-error"
              )}
              {...register("email")}
              autoFocus
            />
          </div>
          {errors.email && (
            <p className="text-sm text-error flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </p>
          )}
        </div>

        <Button
          variant="primary"
          fullWidth
          size="lg"
          type="submit"
          disabled={isLoading}
          className="!rounded-xl h-12 mt-4 font-bold"
        >
          {isLoading
            ? t("auth.forgotPassword.submitting")
            : t("auth.forgotPassword.submit")}
        </Button>

        <div className="text-center pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-coffee-600 hover:text-coffee-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />{" "}
            {t("auth.forgotPassword.backToLogin")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
