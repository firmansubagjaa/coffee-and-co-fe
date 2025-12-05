import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../features/cart/store";
import { useCart, useClearCart, useCreateOrder } from "@/api";
import { CartStep } from "./steps/CartStep";
import { DetailsStep } from "./steps/DetailsStep";
import { PaymentStep } from "./steps/PaymentStep";
import { ReviewStep } from "./steps/ReviewStep";
import { SEO } from "@/components/common/SEO";
import { useLanguage } from "../../contexts/LanguageContext";
import { PaymentMethod, Order } from "@/types";
import { CheckCircle } from "lucide-react";
import { cn } from "../../utils/cn";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/Breadcrumb";

const STEPS = [
  { id: "cart" },
  { id: "details" },
  { id: "payment" },
  { id: "review" },
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { checkoutDetails } = useCartStore();
  const { data: cart, isLoading } = useCart();
  const clearCartMutation = useClearCart();
  const createOrderMutation = useCreateOrder();
  
  const items = cart || [];
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Guard: Redirect to menu if cart is empty (but not while loading)
  useEffect(() => {
    if (!isLoading && items.length === 0 && currentStep === 0) {
      toast.error("Your cart is empty");
      navigate("/menu");
    }
  }, [items.length, currentStep, navigate, isLoading]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    handleNext();
  };

  const handlePlaceOrder = async () => {
    if (!checkoutDetails || !paymentMethod) {
      toast.error("Please complete all checkout steps");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order via backend API
      const order = await createOrderMutation.mutateAsync({
        cartItems: items,
        details: {
          paymentMethod,
          deliveryAddress: checkoutDetails.address,
          deliveryNote: checkoutDetails.deliveryNote,
        },
      });

      // Clear cart after successful order
      clearCartMutation.mutate();

      // Navigate to thank you page with order details
      navigate("/thank-you", {
        state: {
          order: {
            id: order.id,
            total: order.total,
            items: order.items,
            date: order.date,
            location: order.location,
          },
        },
      });

      toast.success("Order placed successfully!");
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CartStep onNext={handleNext} />;
      case 1:
        return <DetailsStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return (
          <PaymentStep
            onNext={handlePaymentSelect}
            onBack={handleBack}
            initialMethod={paymentMethod}
          />
        );
      case 3:
        return (
          <ReviewStep
            paymentMethod={paymentMethod}
            onBack={handleBack}
            onConfirm={handlePlaceOrder}
            isProcessing={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6 pb-20">
      <SEO
        title="Checkout"
        description="Complete your order securely. Review your items, enter delivery details, and choose your payment method."
      />

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink to="/">{t("nav.home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("checkout.title")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Stepper */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2 md:gap-4">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              const isPending = idx > currentStep;

              return (
                <div key={step.id} className="flex items-center gap-2 md:gap-4">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-all duration-300",
                      isActive
                        ? "bg-coffee-900 text-white dark:bg-white dark:text-coffee-900 shadow-lg scale-105"
                        : "bg-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-colors",
                        isActive
                          ? "bg-white text-coffee-900 dark:bg-coffee-900 dark:text-white"
                          : isCompleted
                          ? "bg-success text-success-foreground"
                          : "bg-coffee-100 dark:bg-coffee-800 text-coffee-400 dark:text-coffee-500"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <span
                      className={cn(
                        "font-medium text-xs md:text-sm hidden sm:inline",
                        isActive
                          ? "opacity-100"
                          : isCompleted
                          ? "text-coffee-900 dark:text-white opacity-80"
                          : "text-coffee-400 dark:text-coffee-600"
                      )}
                    >
                      {t(`checkout.steps.${step.id}`)}
                    </span>
                  </div>

                  {idx < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "w-4 md:w-8 h-0.5 rounded-full transition-colors",
                        isCompleted
                          ? "bg-success/50"
                          : "bg-coffee-100 dark:bg-coffee-800"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">{renderStep()}</div>
      </div>
    </div>
  );
};
