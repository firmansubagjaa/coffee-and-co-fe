/**
 * Type Transformers - Convert Backend Responses to Frontend Types
 *
 * Backend (ElysiaJS + Prisma) uses snake_case and Decimal strings
 * Frontend (React) uses camelCase and numbers
 */

import {
  Product,
  User,
  Order,
  CartItem,
  Review,
  StoreLocation,
  JobPosting,
  ProductVariant,
} from "@/types";

// ============================================
// PRODUCT TRANSFORMERS
// ============================================

interface BackendProduct {
  id: string;
  name: string;
  description: string | null;
  category: string;
  base_price: string; // Decimal string from Prisma
  rating: string | null;
  origin: string | null;
  roast_level: string | null;
  tasting_notes: string[];
  is_active: boolean;
  created_at: string;
  isFavorited?: boolean;
  variants?: BackendProductVariant[];
  sizes?: BackendProductSize[];
  grind_options?: BackendGrindOption[];
  images?: BackendProductImage[];
}

interface BackendProductVariant {
  id: string;
  name: string;
  price_adjustment: string;
  sku: string;
  stock: number;
}

interface BackendProductSize {
  id: string;
  size: string;
  price_adjustment: string;
}

interface BackendGrindOption {
  id: string;
  grind_type: string;
}

interface BackendProductImage {
  id: string;
  url: string;
  is_primary: boolean;
}

export const transformProduct = (be: BackendProduct): Product => {
  const primaryImage =
    be.images?.find((img) => img.is_primary)?.url ??
    be.images?.[0]?.url ??
    "/placeholder-product.jpg";

  return {
    id: be.id,
    name: be.name,
    description: be.description ?? "",
    category: be.category as "coffee" | "pastry" | "merch",
    price: parseFloat(be.base_price),
    rating: be.rating ? parseFloat(be.rating) : 0,
    image: primaryImage,
    images: be.images?.map((img) => img.url),
    origin: be.origin ?? undefined,
    roastLevel: be.roast_level as Product["roastLevel"],
    tastingNotes: be.tasting_notes ?? [],
    variants: be.variants?.map(transformVariant),
    sizes: be.sizes?.map((s) => s.size),
    grindOptions: be.grind_options?.map((g) => g.grind_type),
  };
};

export const transformVariant = (
  be: BackendProductVariant
): ProductVariant => ({
  id: be.id,
  name: be.name,
  price: parseFloat(be.price_adjustment),
  stock: be.stock,
  sku: be.sku,
});

export const transformProducts = (products: BackendProduct[]): Product[] =>
  products.map(transformProduct);

// ============================================
// USER TRANSFORMERS
// ============================================

interface BackendUser {
  id: string;
  email: string;
  full_name: string | null;
  role: "customer" | "barista" | "admin" | "superadmin" | "data_analyst";
  mobile: string | null;
  address: string | null;
  streak: number;
  last_visit: string | null;
  avatar_url: string | null;
  avatar_color: string | null;
  preferred_language: string | null;
  is_verified: boolean;
}

export const transformUser = (be: BackendUser): User => {
  const nameParts = (be.full_name ?? "User").split(" ");
  const firstName = nameParts[0] ?? "User";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    id: be.id,
    email: be.email,
    name: be.full_name ?? "User",
    firstName,
    lastName,
    role: be.role,
    mobile: be.mobile ?? "",
    address: be.address ?? "",
    streak: be.streak,
    lastVisit: be.last_visit ?? new Date().toISOString(),
    avatarColor: be.avatar_color ?? "795548",
  };
};

// ============================================
// ORDER TRANSFORMERS
// ============================================

interface BackendOrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_time: string;
  product: BackendProduct;
  variant?: BackendProductVariant | null;
  size?: BackendProductSize | null;
  grind_option?: BackendGrindOption | null;
}

interface BackendOrderTimeline {
  id: string;
  status: string;
  timestamp: string;
}

interface BackendOrder {
  id: string;
  user_id: string;
  total_amount: string;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  payment_method: string | null;
  payment_status: "paid" | "unpaid" | "refunded";
  location: string | null;
  delivery_address: string | null;
  delivery_note: string | null;
  created_at: string;
  items: BackendOrderItem[];
  timeline?: BackendOrderTimeline[];
  user?: BackendUser;
}

// Map BE status to FE display status
const orderStatusMap: Record<string, Order["status"]> = {
  pending: "In process",
  preparing: "In process",
  ready: "In process",
  completed: "Delivered",
  cancelled: "Cancelled",
};

export const transformOrder = (be: BackendOrder): Order => ({
  id: `#${be.id.slice(0, 7).toUpperCase()}`,
  backendId: be.id, // Store full UUID for API calls
  userId: be.user_id,
  status: orderStatusMap[be.status] ?? "In process",
  date: new Date(be.created_at).toLocaleDateString("en-GB"),
  createdAt: be.created_at, // Store full ISO timestamp
  location: be.delivery_address ?? be.location ?? "",
  total: parseFloat(be.total_amount),
  customerName: be.user?.full_name ?? undefined,
  items: be.items.map((item) => transformOrderItemToCartItem(item)),
  timeline:
    be.timeline?.map((t, index, arr) => ({
      label: t.status.charAt(0).toUpperCase() + t.status.slice(1),
      date: new Date(t.timestamp).toLocaleDateString("en-GB"),
      status: index === arr.length - 1 ? "current" : "completed",
    })) ?? [],
});

const transformOrderItemToCartItem = (item: BackendOrderItem): CartItem => ({
  id: item.product.id,
  cartId: item.id,
  name: item.product.name,
  description: item.product.description ?? "",
  price: parseFloat(item.price_at_time),
  quantity: item.quantity,
  category: item.product.category as "coffee" | "pastry" | "merch",
  rating: item.product.rating ? parseFloat(item.product.rating) : 0,
  image: item.product.images?.[0]?.url ?? "/placeholder-product.jpg",
  selectedSize: item.size?.size,
  selectedGrind: item.grind_option?.grind_type,
  selectedVariant: item.variant ? transformVariant(item.variant) : undefined,
});

// ============================================
// REVIEW TRANSFORMERS
// ============================================

interface BackendReview {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  helpful_count: number;
  created_at: string;
  user?: BackendUser;
}

export const transformReview = (be: BackendReview): Review => ({
  id: be.id,
  productId: be.product_id,
  userId: be.user_id,
  userName: be.user?.full_name ?? "Anonymous",
  avatarColor: be.user?.avatar_color ?? "795548",
  rating: be.rating,
  comment: be.comment ?? "",
  createdAt: be.created_at,
  likes: be.helpful_count,
});

// ============================================
// STORE & JOB TRANSFORMERS
// ============================================

interface BackendStore {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  opening_hours: string | null;
  is_active: boolean;
  image_url?: string;
}

export const transformStore = (be: BackendStore): StoreLocation => ({
  id: be.id,
  name: be.name,
  address: be.address,
  phone: be.phone ?? "",
  hours: be.opening_hours ?? "Mon-Sun: 8AM - 10PM",
  image: be.image_url ?? "/placeholder-store.jpg",
  status: be.is_active ? "Open" : "Coming Soon",
});

interface BackendJob {
  id: string;
  title: string;
  description: string;
  type: string;
  department: string;
  location: string;
  status: string;
}

export const transformJob = (be: BackendJob): JobPosting => ({
  id: be.id,
  title: be.title,
  type: be.type as JobPosting["type"],
  location: be.location,
  department: be.department,
  status: be.status === "active" ? "Active" : "Closed",
});

// ============================================
// EXPORT BACKEND TYPES (for API layer)
// ============================================

export type {
  BackendProduct,
  BackendProductVariant,
  BackendUser,
  BackendOrder,
  BackendOrderItem,
  BackendReview,
  BackendStore,
  BackendJob,
};
