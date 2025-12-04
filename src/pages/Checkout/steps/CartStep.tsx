import React from "react";
import { useCartStore } from "../../../features/cart/store";
import { Button } from "../../../components/common/Button";
import { CURRENCY } from "../../../utils/constants";
import { Trash2, Plus, Minus, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { useLanguage } from "../../../contexts/LanguageContext";

interface CartStepProps {
  onNext: () => void;
}

export const CartStep: React.FC<CartStepProps> = ({ onNext }) => {
  const { items, updateQuantity, removeFromCart, total } = useCartStore();
  const { t } = useLanguage();
  const subtotal = total();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-coffee-500 dark:text-coffee-400 mb-6 text-lg">
          {t("cart.empty")}
        </p>
        <Button
          onClick={() => (window.location.href = "/menu")}
          variant="outline"
        >
          {t("cart.browseMenu")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-coffee-900 rounded-[2rem] p-6 md:p-8 shadow-sm border border-coffee-100 dark:border-coffee-800">
        <h2 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white mb-6">
          {t("cart.title")}
        </h2>

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 md:gap-6 pb-6 border-b border-coffee-100 dark:border-coffee-800 last:border-0 last:pb-0"
            >
              <div className="w-20 h-24 md:w-24 md:h-28 bg-coffee-50 dark:bg-coffee-800 rounded-2xl overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-coffee-900 dark:text-white text-lg">
                      {item.name}
                    </h3>
                    <p className="text-sm text-coffee-500 dark:text-coffee-400 capitalize">
                      {item.category}
                    </p>
                  </div>
                  <p className="font-bold text-coffee-900 dark:text-white text-lg">
                    {CURRENCY}
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center bg-coffee-50 dark:bg-coffee-800 rounded-full h-10 px-1 border border-coffee-100 dark:border-coffee-700">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-full flex items-center justify-center text-coffee-600 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-white transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-coffee-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-full flex items-center justify-center text-coffee-600 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 text-coffee-400 hover:text-error transition-colors rounded-full hover:bg-error/10 dark:hover:bg-error/20">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("cart.removeTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("cart.removeDesc")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t("common.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeFromCart(item.id)}
                        >
                          {t("common.remove")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={onNext} className="w-full md:w-auto px-12">
          {t("common.next")}
        </Button>
      </div>
    </div>
  );
};
