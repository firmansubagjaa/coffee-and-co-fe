import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../features/cart/store";
import { useOrderStore } from "../../features/orders/store";
import { Button } from "../../components/common/Button";
import { CURRENCY } from "../../utils/constants";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Loader2,
  Wallet,
  QrCode,
  Building,
  CheckCircle,
  ChevronRight,
  AlertTriangle,
  ShoppingBag,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentMethod, Order } from "@/types";
import { toast } from "sonner";
import { useLanguage } from "../../contexts/LanguageContext";
import { SEO } from "@/components/common/SEO";
import { cn } from "../../utils/cn";

const STEPS = [
  { id: "cart", label: "Cart" },
  { id: "details", label: "Details" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { total, clearCart, items, checkoutDetails } = useCartStore();
  const { addOrder } = useOrderStore();
  const { t } = useLanguage();

  const [step, setStep] = useState<
    "method" | "instruction" | "verifying" | "success"
  >("method");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [countdown, setCountdown] = useState(300); // 5 mins for payment simulation

  const amount = total();
  const shippingCost = amount > 30 ? 0 : 5;
  const grandTotal = amount + shippingCost;

  // Protect route
  useEffect(() => {
    if (items.length === 0 && step !== "success") {
      navigate("/cart");
    }
  }, [items, navigate, step]);

  useEffect(() => {
    if (step === "instruction" && countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep("instruction");
  };

  const handleSimulatePayment = () => {
    setStep("verifying");

    // Simulate verification delay
    setTimeout(() => {
      setStep("success");
      // Actually create the order in the system
      const newOrder: Order = {
        id: `#ORD-${Math.floor(Math.random() * 1000000)}`,
        userId: "1", // Mock User ID
        items: [...items],
        total: grandTotal,
        status: "In process",
        date: new Date().toISOString(),
        location: checkoutDetails
          ? `${checkoutDetails.address}`
          : "Store Pickup",
        timeline: [
          {
            label: "Order Placed",
            date: new Date().toLocaleDateString(),
            status: "completed",
          },
          {
            label: "Payment Verified",
            date: new Date().toLocaleDateString(),
            status: "completed",
          },
          { label: "Processing", date: "Expected tomorrow", status: "current" },
        ],
      };
      addOrder(newOrder);
    }, 3000);
  };

  const handleFinish = () => {
    // Create a temporary order object to pass to the Thank You page
    const orderSummary = {
      id: `#ORD-${Math.floor(Math.random() * 1000000)}`,
      total: grandTotal,
      items: [...items],
      date: new Date().toISOString(),
      location: checkoutDetails ? `${checkoutDetails.address}` : "Store Pickup",
    };

    clearCart();
    navigate("/thank-you", { state: { order: orderSummary } });
  };

  const renderInstruction = () => {
    if (!selectedMethod) return null;

    switch (selectedMethod) {
      case "bank_transfer":
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-info/10 dark:bg-info/20 p-6 rounded-2xl border border-info/20 dark:border-info/30 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs text-info dark:text-info font-bold uppercase tracking-wider mb-2">
                  BCA Virtual Account
                </p>
                <p className="text-3xl font-mono font-bold text-info dark:text-info tracking-widest">
                  8801 2345 6789 000
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-info dark:text-info hover:bg-info/20 dark:hover:bg-info/30"
                onClick={() => toast.success(t("checkout.payment.copied"))}
              >
                {t("common.copy") || "Copy"}
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-coffee-400 leading-relaxed">
              {t("checkout.payment.instruction.transfer")}
            </p>
          </div>
        );
      case "gopay":
      case "qris":
        return (
          <div className="flex flex-col items-center justify-center space-y-6 py-6 animate-in fade-in zoom-in">
            <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 dark:border-coffee-800 shadow-lg relative">
              <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-3xl m-2 pointer-events-none"></div>
              <QrCode className="w-48 h-48 text-gray-900" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Scan QR
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-coffee-800 px-4 py-2 rounded-full">
              {t("checkout.payment.instruction.scan")}
            </p>
          </div>
        );
      case "credit_card":
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 border rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="flex justify-between items-start mb-8">
                <CreditCard className="w-8 h-8 text-white/80" />
                <span className="font-mono text-white/50">DEBIT</span>
              </div>
              <p className="font-mono text-2xl tracking-widest mb-6">
                0000 0000 0000 0000
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
                    Card Holder
                  </p>
                  <p className="font-medium tracking-wide">JOHN DOE</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
                    Expires
                  </p>
                  <p className="font-medium tracking-wide">12/25</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-coffee-400 mt-2">
              {t("checkout.payment.instruction.card")}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-coffee-900 rounded-[3rem] p-12 text-center max-w-lg w-full shadow-2xl border border-coffee-100 dark:border-coffee-800"
        >
          <div className="w-24 h-24 bg-success/10 dark:bg-success/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="w-12 h-12 text-success dark:text-success" />
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-success"
            />
          </div>
          <h2 className="text-3xl font-serif font-bold text-coffee-900 dark:text-white mb-4">
            {t("common.success")}
          </h2>
          <p className="text-coffee-600 dark:text-coffee-300 mb-10 text-lg">
            {t("checkout.payment.successDesc")}
          </p>

          <Button
            fullWidth
            onClick={handleFinish}
            size="lg"
            className="rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            {t("checkout.payment.return")}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6 pb-20">
      <SEO
        title="Secure Checkout"
        description="Complete your purchase securely. Choose your preferred payment method and get ready to enjoy your Coffee & Co order."
      />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Progress Stepper */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {STEPS.map((s, idx) => {
              const isActive = s.id === "payment";
              const isPast = ["cart", "details"].includes(s.id);

              return (
                <div key={s.id} className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                      isActive
                        ? "bg-coffee-900 text-white dark:bg-white dark:text-coffee-900 shadow-lg"
                        : isPast
                        ? "text-coffee-900 dark:text-white opacity-50"
                        : "text-coffee-300 dark:text-coffee-700"
                    )}
                  >
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        isActive
                          ? "bg-white text-coffee-900 dark:bg-coffee-900 dark:text-white"
                          : isPast
                          ? "bg-coffee-200 dark:bg-coffee-800"
                          : "bg-coffee-100 dark:bg-coffee-800"
                      )}
                    >
                      {isPast ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </span>
                    <span className="font-medium text-sm hidden md:inline">
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="w-8 h-px bg-coffee-200 dark:bg-coffee-800 hidden md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Left Column: Payment Methods */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate("/cart")}
                className="p-2 hover:bg-coffee-100 dark:hover:bg-coffee-800 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-coffee-900 dark:text-white" />
              </button>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white">
                {step === "method"
                  ? t("checkout.payment.title")
                  : "Complete Payment"}
              </h1>
            </div>

            <motion.div
              layout
              className="bg-white dark:bg-coffee-900 rounded-[2.5rem] p-8 shadow-sm border border-coffee-100 dark:border-coffee-800 relative overflow-hidden"
            >
              {/* Secure Badge */}
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <ShieldCheck className="w-32 h-32" />
              </div>

              {step === "method" && (
                <div className="space-y-4 relative z-10">
                  <p className="text-coffee-500 dark:text-coffee-400 mb-6">
                    Select your preferred payment method to proceed.
                  </p>

                  {[
                    {
                      id: "bank_transfer",
                      icon: Building,
                      label: t("checkout.payment.methods.transfer"),
                    },
                    {
                      id: "gopay",
                      icon: Wallet,
                      label: t("checkout.payment.methods.gopay"),
                    },
                    {
                      id: "qris",
                      icon: QrCode,
                      label: t("checkout.payment.methods.qris"),
                    },
                    {
                      id: "credit_card",
                      icon: CreditCard,
                      label: t("checkout.payment.methods.creditCard"),
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() =>
                        handleMethodSelect(method.id as PaymentMethod)
                      }
                      className="w-full flex items-center justify-between p-5 rounded-2xl border border-coffee-100 dark:border-coffee-700 hover:border-coffee-900 dark:hover:border-white hover:bg-coffee-50 dark:hover:bg-coffee-800 transition-all group bg-white dark:bg-coffee-900"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-coffee-50 dark:bg-coffee-800 rounded-xl group-hover:bg-white dark:group-hover:bg-coffee-700 transition-colors shadow-sm">
                          <method.icon className="w-6 h-6 text-coffee-600 dark:text-coffee-300" />
                        </div>
                        <span className="font-bold text-lg text-coffee-900 dark:text-white group-hover:text-coffee-700 dark:group-hover:text-coffee-100">
                          {method.label}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-coffee-50 dark:bg-coffee-800 flex items-center justify-center group-hover:bg-coffee-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-coffee-900 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step === "instruction" && (
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8 bg-coffee-50 dark:bg-coffee-800 p-4 rounded-2xl">
                    <button
                      onClick={() => setStep("method")}
                      className="text-sm text-coffee-600 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-white font-bold flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />{" "}
                      {t("checkout.payment.changeMethod")}
                    </button>
                    <div className="text-right flex items-center gap-3">
                      <p className="text-[10px] uppercase text-coffee-400 font-bold tracking-widest hidden sm:block">
                        {t("checkout.payment.expiresIn")}
                      </p>
                      <div className="font-mono text-error font-bold bg-white dark:bg-coffee-900 px-3 py-1 rounded-lg shadow-sm border border-error/20 dark:border-error/30">
                        {formatTime(countdown)}
                      </div>
                    </div>
                  </div>

                  <div className="mb-10">{renderInstruction()}</div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl flex gap-3 items-start mb-8 border border-yellow-100 dark:border-yellow-900/30">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-200 leading-relaxed font-medium">
                      {t("checkout.payment.instruction.simulation")}
                    </p>
                  </div>

                  <Button
                    fullWidth
                    onClick={handleSimulatePayment}
                    size="lg"
                    className="rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                  >
                    {t("checkout.payment.simulate")}
                  </Button>
                </div>
              )}

              {step === "verifying" && (
                <div className="py-20 text-center relative z-10">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-coffee-100 dark:border-coffee-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-coffee-600 dark:border-white rounded-full border-t-transparent animate-spin"></div>
                    <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-coffee-600 dark:text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-coffee-900 dark:text-white mb-3">
                    {t("checkout.payment.verifying")}
                  </h3>
                  <p className="text-coffee-500 dark:text-coffee-400">
                    {t("checkout.payment.doNotClose")}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-32">
              <div className="bg-white dark:bg-coffee-900 rounded-[2.5rem] p-8 shadow-lg border border-coffee-100 dark:border-coffee-800">
                <h3 className="font-serif font-bold text-xl text-coffee-900 dark:text-white mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-coffee-50 dark:bg-coffee-800 rounded-xl overflow-hidden shrink-0 border border-coffee-100 dark:border-coffee-700">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-coffee-900 dark:text-white text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-coffee-500 dark:text-coffee-400 mb-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-bold text-coffee-700 dark:text-coffee-200 text-sm">
                          {CURRENCY}
                          {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-coffee-100 dark:border-coffee-800 pt-6 space-y-3">
                  <div className="flex justify-between text-sm text-coffee-600 dark:text-coffee-300">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      {CURRENCY}
                      {amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-coffee-600 dark:text-coffee-300">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0
                        ? "Free"
                        : `${CURRENCY}${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-coffee-900 dark:text-white pt-3 border-t border-coffee-100 dark:border-coffee-800">
                    <span>Total</span>
                    <span>
                      {CURRENCY}
                      {grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {checkoutDetails && (
                  <div className="mt-6 pt-6 border-t border-coffee-100 dark:border-coffee-800">
                    <div className="flex items-start gap-3 text-sm text-coffee-600 dark:text-coffee-300 bg-coffee-50 dark:bg-coffee-800/50 p-4 rounded-xl">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{checkoutDetails.address}</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-coffee-400 font-medium">
                  <Lock className="w-3 h-3" />
                  Secure SSL Encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
