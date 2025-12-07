import React, { useEffect, useState } from "react";
import { AuthLayout } from "./components/AuthLayout";
import { Button } from "../../components/common/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyResetOtp, useResendOtp, getAuthError } from "@/api";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Label } from "../../components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "../../components/ui/input-otp";
import { useLanguage } from "../../contexts/LanguageContext";

export const ForgotPasswordOtp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verifyResetOtpMutation = useVerifyResetOtp();
  const resendOtpMutation = useResendOtp();
  const { t } = useLanguage();
  const [resetToken, setResetToken] = useState<string | null>(null);

  const email = searchParams.get("email");

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: "" },
  });

  // Protect route
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const onSubmit = async (data: { otp: string }) => {
    if (!email) return;

    verifyResetOtpMutation.mutate(
      { email, otp: data.otp },
      {
        onSuccess: (result) => {
          toast.success(t("auth.verifyOtp.success"));
          setResetToken(result.resetToken);
          // Navigate to reset password with token
          navigate(`/reset-password?token=${result.resetToken}`);
        },
        onError: (error) => {
          setError("otp", {
            type: "manual",
            message: t("auth.verifyOtp.validation.invalid"),
          });
          toast.error(getAuthError(error) || t("auth.verifyOtp.error"));
        },
      }
    );
  };

  const handleResend = async () => {
    if (!email) return;

    resendOtpMutation.mutate(
      { email, type: "password_reset" },
      {
        onSuccess: () => {
          toast.success(t("auth.verifyOtp.resent"));
        },
        onError: (error) => {
          toast.error(getAuthError(error) || "Failed to resend code");
        },
      }
    );
  };

  return (
    <AuthLayout
      title={t("auth.verifyOtp.title")}
      subtitle={`${t("auth.verifyOtp.subtitle")} ${email}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 flex flex-col items-center">
          <Label htmlFor="otp" className="sr-only">
            {t("auth.verifyOtp.label")}
          </Label>

          <Controller
            name="otp"
            control={control}
            rules={{
              required: t("auth.verifyOtp.validation.required"),
              minLength: {
                value: 6,
                message: t("auth.verifyOtp.validation.length"),
              },
            }}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />

          {errors.otp && (
            <p className="text-sm text-error flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.otp.message}
            </p>
          )}

          <p className="text-xs text-coffee-500 dark:text-coffee-400">
            {t("auth.verifyOtp.checkEmail")}
          </p>
        </div>

        <Button
          variant="primary"
          fullWidth
          size="lg"
          type="submit"
          disabled={verifyResetOtpMutation.isPending}
          className="!rounded-xl h-12 mt-4 font-bold"
        >
          {verifyResetOtpMutation.isPending
            ? t("auth.verifyOtp.submitting")
            : t("auth.verifyOtp.submit")}
        </Button>

        <div className="text-center pt-4 flex flex-col gap-4">
          <p className="text-sm text-coffee-600 dark:text-coffee-400">
            {t("auth.verifyOtp.resendText")}{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendOtpMutation.isPending}
              className="font-bold text-coffee-900 dark:text-white underline hover:no-underline disabled:opacity-50"
            >
              {t("auth.verifyOtp.resendLink")}
            </button>
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-coffee-600 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("auth.verifyOtp.backToLogin")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
