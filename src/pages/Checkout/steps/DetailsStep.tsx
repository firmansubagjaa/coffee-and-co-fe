import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "../../../features/cart/store";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useLanguage } from "../../../contexts/LanguageContext";
import { CheckoutDetails } from "@/types";
import { cn } from "../../../utils/cn";

interface DetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({ onNext, onBack }) => {
  const { t } = useLanguage();
  const { setCheckoutDetails, checkoutDetails } = useCartStore();

  const checkoutSchema = z.object({
    fullName: z.string().min(2, t("checkout.validation.nameShort")),
    mobile: z.string().min(10, t("checkout.validation.mobileInvalid")),
    email: z.string().email(t("checkout.validation.emailInvalid")),
    address: z.string().min(5, t("checkout.validation.addressShort")),
    deliveryNote: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutDetails>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutDetails || {
      fullName: "Anna Kitchg",
      mobile: "+49 301234567",
      email: "annakitch@gmail.com",
      address: "Berlin, Lindenstrabe 27, 39112",
      deliveryNote: "",
    },
  });

  const onSubmit = (data: CheckoutDetails) => {
    setCheckoutDetails(data);
    onNext();
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-white dark:bg-coffee-900 rounded-[2rem] p-6 md:p-8 shadow-sm border border-coffee-100 dark:border-coffee-800 mb-6">
        <h2 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white mb-6">
          {t("checkout.contactInfo")}
        </h2>

        <form
          id="details-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className={
                errors.fullName ? "text-error" : "dark:text-coffee-100"
              }
            >
              {t("checkout.fullName")}
            </Label>
            <Input
              id="fullName"
              className={cn(
                "h-12",
                errors.fullName && "border-error focus-visible:ring-error/40"
              )}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-error">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="mobile"
                className={
                  errors.mobile ? "text-error" : "dark:text-coffee-100"
                }
              >
                {t("settings.mobile")}
              </Label>
              <Input
                id="mobile"
                className={cn(
                  "h-12",
                  errors.mobile && "border-error focus-visible:ring-error/40"
                )}
                {...register("mobile")}
              />
              {errors.mobile && (
                <p className="text-xs text-error">{errors.mobile.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className={errors.email ? "text-error" : "dark:text-coffee-100"}
              >
                {t("settings.email")}
              </Label>
              <Input
                id="email"
                type="email"
                className={cn(
                  "h-12",
                  errors.email && "border-error focus-visible:ring-error/40"
                )}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-error">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="border-t border-coffee-100 dark:border-coffee-800 my-6"></div>

          <div className="space-y-2">
            <Label
              htmlFor="address"
              className={errors.address ? "text-error" : "dark:text-coffee-100"}
            >
              {t("checkout.address")}
            </Label>
            <Input
              id="address"
              className={cn(
                "h-12",
                errors.address && "border-error focus-visible:ring-error/40"
              )}
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-error">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryNote" className="dark:text-coffee-100">
              {t("checkout.deliveryNote")}
            </Label>
            <Input
              id="deliveryNote"
              placeholder={t("cart.notePlaceholder")}
              className="h-12"
              {...register("deliveryNote")}
            />
          </div>
        </form>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={onBack} className="px-8">
          {t("common.back")}
        </Button>
        <Button size="lg" type="submit" form="details-form" className="px-12">
          {t("common.next")}
        </Button>
      </div>
    </div>
  );
};
