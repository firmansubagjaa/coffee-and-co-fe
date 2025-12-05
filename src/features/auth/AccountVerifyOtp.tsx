import React, { useEffect } from "react";
import { AuthLayout } from "./components/AuthLayout";
import { Button } from "../../components/common/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyOtp, useResendOtp, getAuthError } from "@/api";
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

export const AccountVerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
 
  const email = searchParams.get("email");
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: "" },
  });

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const onSubmit = async (data: { otp: string }) => {
    if (!email) return;
    
    verifyOtpMutation.mutate(
      { email, otp: data.otp },
      {
        onSuccess: () => {
          toast.success(t("auth.verifyOtp.success"), {
            description: t("auth.verifyOtp.redirecting"),
          });
          setTimeout(() => {
            navigate("/login");
          }, 1500);
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
    
    resendOtpMutation.mutate(email, {
      onSuccess: () => {
        toast.success(t("auth.verifyOtp.resent"));
      },
      onError: (error) => {
        toast.error(getAuthError(error) || "Failed to resend code");
      },
    });
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
            {t("auth.verifyOtp.tip")}{" "}
            <strong className="text-coffee-900 dark:text-white">123456</strong>
          </p>
        </div>

        <Button
          variant="primary"
          fullWidth
          size="lg"
          type="submit"
          disabled={verifyOtpMutation.isPending}
          className="!rounded-xl h-12 mt-4 font-bold"
        >
          {verifyOtpMutation.isPending
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
            to="/register"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-coffee-600 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("auth.verifyOtp.backToRegister")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
