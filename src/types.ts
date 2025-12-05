
export type Role = 'customer' | 'barista' | 'admin' | 'superadmin' | 'data_analyst';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Small", "Large", "Almond Milk"
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  subDescriptions?: string[]; // Highlights/Bullet points
  price: number; // Display/Base price
  category: 'coffee' | 'pastry' | 'merch';
  image: string; // Primary thumbnail
  images?: string[]; // Array for carousel
  rating: number;
  
  // Specific fields
  origin?: string;
  roastLevel?: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  tastingNotes?: string[];
  
  // Critical Update: Variants are now the primary way to handle size/options
  variants?: ProductVariant[];
  
  // Deprecated/Legacy support (optional)
  sizes?: string[]; 
  grindOptions?: string[];
}

export interface CartItem extends Product {
  cartId: string; // Unique ID for the cart line item (productId + variantId)
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedSize?: string;
  selectedGrind?: string;
}

export interface User {
  id: string;
  name: string; // Full Name
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  streak: number;
  lastVisit: string;
  mobile: string;
  address: string;
  deliveryNote?: string;
  avatarColor?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;  // Display ID: #888AB80
  backendId: string;  // Full backend UUID for API calls
  userId: string;
  items: CartItem[];
  total: number;
  status: 'In process' | 'Delivered' | 'Cancelled';
  date: string;  // Formatted date for display
  createdAt: string;  // ISO timestamp from backend
  location: string;
  customerName?: string;
  timeline: {
      label: string;
      date: string;
      status: 'completed' | 'current' | 'pending';
  }[];
}

export interface CheckoutDetails {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  deliveryNote?: string;
}

export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'gopay' | 'shopeepay' | 'qris';

// --- Logistics / Station Types ---

export type StationStatus = 'ok' | 'low' | 'critical' | 'maintenance' | 'calibrating';

export interface StationItem {
  id: string;
  name: string;
  category: 'machine' | 'beans' | 'dairy' | 'dry_goods';
  status: StationStatus;
  value?: number | string;
  unit?: string;
  lastChecked: string;
}

// --- CMS & Feature Interfaces ---

export interface Review {
  id: string;
  productId: string; // ✅ Added for backend compatibility
  userId: string;
  userName: string;
  userAvatar?: string; // ✅ Added from backend user data
  avatarColor?: string;
  rating: number;
  comment: string;
  createdAt: string; // ✅ Renamed from date for backend compatibility
  likes?: number; // Optional for future feature
}

export interface JobPosting {
  id: string;
  title: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  location: string;
  department: string;
  status: 'Active' | 'Closed';
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string; // Added image field
  status: 'Open' | 'Renovation' | 'Coming Soon';
}
