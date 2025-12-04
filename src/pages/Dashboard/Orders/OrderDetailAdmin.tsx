import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  RotateCcw,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../../components/common/Button";
import { Badge } from "../../../components/ui/badge";
import { CURRENCY } from "../../../utils/constants";

import { toast } from "sonner";
import { useLanguage } from "../../../contexts/LanguageContext";
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

// Mock Data for a single order
const getMockOrder = (id: string) => ({
  id: id,
  date: "May 24, 2024 at 10:30 AM",
  status: "Completed",
  paymentStatus: "Paid",
  paymentMethod: "Credit Card (**** 4242)",
  customer: {
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 123-4567",
    avatarColor: "1e40af",
  },
  shipping: {
    address: "123 Coffee Lane, Apt 4B",
    city: "New York",
    country: "United States",
    zip: "10001",
    method: "Express Delivery",
  },
  items: [
    {
      id: "1",
      name: "Espresso Romano",
      variant: "Small",
      sku: "ESP-ROM-S",
      price: 3.5,
      quantity: 2,
      image: "https://picsum.photos/id/1060/200/200",
    },
    {
      id: "2",
      name: "Almond Croissant",
      variant: "Standard",
      sku: "ALM-CRO",
      price: 4.25,
      quantity: 1,
      image: "https://picsum.photos/id/431/200/200",
    },
    {
      id: "3",
      name: "Cold Brew Reserve",
      variant: "Large",
      sku: "COL-BRE-L",
      price: 5.5,
      quantity: 1,
      image: "https://picsum.photos/id/425/200/200",
    },
  ],
  timeline: [
    {
      label: "Order Placed",
      time: "10:30 AM",
      date: "May 24",
      status: "completed",
    },
    {
      label: "Payment Confirmed",
      time: "10:31 AM",
      date: "May 24",
      status: "completed",
    },
    {
      label: "Processing",
      time: "10:45 AM",
      date: "May 24",
      status: "completed",
    },
    { label: "Shipped", time: "02:00 PM", date: "May 24", status: "completed" },
    {
      label: "Delivered",
      time: "04:15 PM",
      date: "May 25",
      status: "completed",
    },
  ],
  subtotal: 16.75,
  tax: 1.34,
  shippingCost: 5.0,
  total: 23.09,
});

export const OrderDetailAdmin: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In real app, useQuery to fetch order details from Backend API
  const order = getMockOrder(id || "TRX-000");

  const handlePrint = () => {
    window.print();
  };

  const handleRefund = () => {
    toast.success(
      t("dashboard.orders.detail.toast.refunded", { id: order.id })
    );
  };

  const getTimelineLabel = (label: string) => {
    switch (label) {
      case "Order Placed":
        return t("dashboard.orders.detail.timeline.placed");
      case "Payment Confirmed":
        return t("dashboard.orders.detail.timeline.confirmed");
      case "Processing":
        return t("dashboard.orders.detail.timeline.processing");
      case "Shipped":
        return t("dashboard.orders.detail.timeline.shipped");
      case "Delivered":
        return t("dashboard.orders.detail.timeline.delivered");
      default:
        return label;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="px-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-coffee-900 flex items-center gap-3">
              {t("dashboard.orders.detail.title", { id: order.id })}
              <Badge
                variant={order.status === "Completed" ? "success" : "warning"}
              >
                {order.status}
              </Badge>
            </h1>
            <p className="text-coffee-500 mt-1">
              {t("dashboard.orders.detail.subtitle", {
                date: order.date,
                count: order.items.length,
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="bg-white border-coffee-200"
          >
            <Printer className="w-4 h-4 mr-2" />{" "}
            {t("dashboard.orders.detail.print")}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-white border-error/30 text-error hover:bg-error/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />{" "}
                {t("dashboard.orders.detail.refund")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("dashboard.orders.detail.refundDialog.title")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("dashboard.orders.detail.refundDialog.desc", {
                    amount: CURRENCY + order.total.toFixed(2),
                  })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("dashboard.orders.detail.refundDialog.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRefund}
                  className="bg-error hover:bg-error/90"
                >
                  {t("dashboard.orders.detail.refundDialog.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Items & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Items */}
          <div className="bg-white rounded-[2rem] border border-coffee-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-coffee-100 flex justify-between items-center">
              <h3 className="font-bold text-coffee-900 text-lg">
                {t("dashboard.orders.detail.sections.items")}
              </h3>
              <span className="text-sm text-coffee-500 font-medium">
                {t("dashboard.orders.detail.labels.shipment", { number: 1 })}
              </span>
            </div>
            <div className="divide-y divide-coffee-50">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center gap-4 hover:bg-coffee-50/30 transition-colors"
                >
                  <div className="w-16 h-16 rounded-xl bg-coffee-50 overflow-hidden shrink-0 border border-coffee-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-coffee-900">{item.name}</p>
                    <p className="text-xs text-coffee-500 font-mono mt-0.5">
                      {t("dashboard.orders.detail.labels.sku")}: {item.sku} •{" "}
                      <span className="text-coffee-600 font-sans">
                        {item.variant}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-coffee-900">
                      {CURRENCY}
                      {item.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-coffee-500">
                      {t("dashboard.orders.detail.labels.qty")}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right w-24 font-bold text-coffee-900">
                    {CURRENCY}
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-coffee-50/50 border-t border-coffee-100 space-y-3">
              <div className="flex justify-between text-sm text-coffee-600">
                <span>{t("dashboard.orders.detail.labels.subtotal")}</span>
                <span>
                  {CURRENCY}
                  {order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-coffee-600">
                <span>{t("dashboard.orders.detail.labels.shipping")}</span>
                <span>
                  {CURRENCY}
                  {order.shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-coffee-600">
                <span>{t("dashboard.orders.detail.labels.tax")}</span>
                <span>
                  {CURRENCY}
                  {order.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-coffee-900 pt-3 border-t border-coffee-200">
                <span>{t("dashboard.orders.detail.labels.total")}</span>
                <span>
                  {CURRENCY}
                  {order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-[2rem] border border-coffee-100 shadow-sm p-6">
            <h3 className="font-bold text-coffee-900 text-lg mb-6">
              {t("dashboard.orders.detail.sections.timeline")}
            </h3>
            <div className="relative border-l-2 border-coffee-100 ml-3 space-y-8 pb-2">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative pl-8">
                  <div
                    className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                      event.status === "completed"
                        ? "bg-coffee-900"
                        : "bg-coffee-200"
                    }`}
                  ></div>
                  <div>
                    <p className="font-bold text-coffee-900 text-sm">
                      {getTimelineLabel(event.label)}
                    </p>
                    <p className="text-xs text-coffee-500">
                      {event.date} at {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Payment */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] border border-coffee-100 shadow-sm p-6">
            <h3 className="font-bold text-coffee-900 text-lg mb-6">
              {t("dashboard.orders.detail.sections.customer")}
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}
                style={{ backgroundColor: `#${order.customer.avatarColor}` }}
              >
                {order.customer.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-coffee-900">
                  {order.customer.name}
                </p>
                <p className="text-xs text-coffee-500">
                  {t("dashboard.orders.detail.labels.registered")}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-coffee-700">
                <Mail className="w-4 h-4 text-coffee-400" />
                {order.customer.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-coffee-700">
                <Phone className="w-4 h-4 text-coffee-400" />
                {order.customer.phone}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-coffee-100 shadow-sm p-6">
            <h3 className="font-bold text-coffee-900 text-lg mb-6">
              {t("dashboard.orders.detail.sections.shipping")}
            </h3>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-coffee-400 shrink-0 mt-0.5" />
              <p className="text-sm text-coffee-700 leading-relaxed">
                {order.shipping.address}
                <br />
                {order.shipping.city}, {order.shipping.zip}
                <br />
                {order.shipping.country}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-coffee-50">
              <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider mb-2">
                {t("dashboard.orders.detail.labels.method")}
              </p>
              <div className="flex gap-3">
                <Package className="w-5 h-5 text-coffee-400 shrink-0 mt-0.5" />
                <p className="text-sm text-coffee-700">
                  {order.shipping.method}
                  <br />
                  <span className="text-xs text-coffee-500">
                    {t("dashboard.orders.detail.labels.tracking")}: #SHP-992812
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-coffee-100 shadow-sm p-6">
            <h3 className="font-bold text-coffee-900 text-lg mb-6">
              {t("dashboard.orders.detail.sections.payment")}
            </h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-success/10 rounded-lg text-success">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-coffee-900 text-sm">
                  {t("dashboard.orders.detail.labels.paymentSuccess")}
                </p>
                <p className="text-xs text-coffee-500">{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
