import React from "react";
import { AuthLayout } from "./components/AuthLayout";
import { Button } from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "./store";
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

export const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const { verifyOTP, isLoading, resetEmail } = useAuthStore();
  const { t } = useLanguage();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: "" },
  });

  // Protect route
  if (!resetEmail) {
    navigate("/forgot-password");
    return null;
  }

  const onSubmit = async (data: { otp: string }) => {
    const isValid = await verifyOTP(data.otp);

    if (isValid) {
      toast.success(t("auth.verifyOtp.success"));
      navigate("/reset-password");
    } else {
      setError("otp", {
        type: "manual",
        message: t("auth.verifyOtp.validation.invalid"),
      });
      toast.error(t("auth.verifyOtp.error"));
    }
  };

  return (
    <AuthLayout
      title={t("auth.verifyOtp.title")}
      subtitle={`${t("auth.verifyOtp.subtitle")} ${resetEmail}`}
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

          <p className="text-xs text-coffee-500">
            {t("auth.verifyOtp.tip")}{" "}
            <strong className="text-coffee-900">123456</strong>
          </p>
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
            ? t("auth.verifyOtp.submitting")
            : t("auth.verifyOtp.submit")}
        </Button>

        <div className="text-center pt-4 flex flex-col gap-4">
          <p className="text-sm text-coffee-600">
            {t("auth.verifyOtp.resendText")}{" "}
            <button
              type="button"
              className="font-bold text-coffee-900 underline"
            >
              {t("auth.verifyOtp.resendLink")}
            </button>
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-coffee-600 hover:text-coffee-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("auth.verifyOtp.backToLogin")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
