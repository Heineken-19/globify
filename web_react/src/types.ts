export type OrderStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  stock: number;
  imageUrls: string[];
  type: string;
  title: string;
  size: string;
  quantity: number;
  water?: string;
  light?: string;
  extra?: string;
  fact?: string;
  isNew?: boolean;
  isSale?: boolean;
  discountPercentage?: number;
  slug: string;
  category: Category;
};

export type Category = {
  id: number;
  name: string;
};

export interface ProductPage {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number; 
  size: number;   
}

export type ProductDetails = {
  light?: string;
  water?: string;
  extra?: string;
  fact?: string;
};


export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  available: boolean;
  title: string;
  size: string;
  type: string;
  imageUrls: string[];
  category: { id: number; name?: string } | string;
  createdAt: string;
  isNew: boolean;
  isSale: boolean;
  discountPercentage?: number | null;

  // 🔽 Új mezők
  light?: string;
  water?: string;
  extra?: string;
  fact?: string;
}

  export interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    nickname?: string;
    birthDate?: string;
    createdAt: string;
    phone:string;
    email: string;
    role: string;
    avatar?: string;
    token?: string;
    rewardPoints?: number;
    referralCode?: string;

  }

  export interface FavoriteItem {
    id: number;
    imageUrl: string;
    name: string;
    price: number;
  }

  export interface ProductModalProps {
    productId: number | null;
    opened: boolean;
    onClose: () => void;
    addToCart: (product: Product) => void;
  }

  export interface FavoriteContextType {
    favorites: Product[];
    loading: boolean;
    error: string | null; 
    addFavorite: (product: Product) => Promise<void>;
    removeFavorite: (productId: number) => Promise<void>;
  }

  export interface RegistrationData {
    date: string;
    registrations: number;
  }

  export interface OrderStats {
    date: string;
    totalOrders: number;
  }

  export interface RevenueData {
    totalRevenue: number;
    startDate: string;
    endDate: string;
  }

  export interface AdminProductModalProps {
    opened: boolean;
    onClose: () => void;
    product?: AdminProduct | null;
  }
  
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrls?: string[];
}

export interface FoxPostPoint {
  place_id: string;
  name: string;
  city: string;
  zip: string;
  address: string;
}

export interface PacketaPoint {
  id: string;
  name: string;
  city: string;
  zip: string;
  address: string;
}

export interface FoxpostPoint {
  place_id: string;
  name: string;
  city: string;
  zip: string;
  address: string;
}

export interface Billing {
  id?: number;
  companyName: string;
  taxNumber: string | null;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  billingType: string;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;  // 1-től 5-ig
  comment: string;
  createdAt: string; // Dátum formátum (ISO string)
}

export interface OrderModalProps {
  orderId: number | null;
  opened: boolean;
  onClose: () => void;
}

export interface OrderItemDTO {
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface BillingDTO {
  companyName: string;
  taxNumber: string | null;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  billingType: string;
}

export interface OrderRequestDTO {
  userId: string;
  items: OrderItemDTO[];
  paymentMethod: string;
  shippingMethod: string;
  shippingPoint: string | null;
  shippingAddress: string | null;
  billingData: BillingDTO;
  totalPrice: number;
  status: string;
}

export interface OrderResponseDTO {
  id: number;
  totalPrice: number;
  createdAt: string;
  status: string;
}

export interface GuestOrderRequestDTO {
  email: string;
  items: OrderItemDTO[];
  paymentMethod: string;
  shippingMethod: string;
  shippingPoint: string | null;
  shippingAddress: string | null;
  billingData: BillingDTO;
  totalPrice: number;
  finalPrice: number;
  couponCode: string | null;
  discountAmount: number;
  discountName: string | null;
  usedRewardPoints: number;
  shippingCost: number;
  status: string;
}

export type OrderData = {
  id: number;
  totalPrice: number;
  finalPrice: number;
  discountAmount: number;
  shippingCost: number;
  createdAt: string;
  status: string;
  paymentMethod: string;
  shippingAddress?: string;
  shippingPoint?: string;
  items: OrderItem[];
  billingData?: {
    city: string;
    companyName: string;
    country: string;
    postalCode: string;
    street: string;
    taxNumber: string;
  }
  usedRewardPoints?: number;
};

export interface Order {
  id: number;
  userEmail: string;
  finalPrice?: number;
  status: OrderStatus;
  quantity: number;
  createdAt: string;
  orderItems: OrderItem[];
  billingInfo: BillingInfo;
  shippingInfo: ShippingInfo;
}

export interface BillingInfo {
  companyName?: string;
  taxNumber?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ShippingInfo {
  address: string;
  shippingMethod: string;
  shippingPoint: string;
}

export interface AdminUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  role: 'USER' | 'ADMIN';
}

export interface Subscriber {
  id: number;
  email: string;
  unsubscribeToken: string;
  subscribed: boolean;
}

export interface ShippingOption {
  id: number; 
  method: 'HOME_DELIVERY' | 'FOXPOST' | 'PACKETA' | 'SHOP';
  price: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}
export type ShippingOptionInput = Omit<ShippingOption, 'id'>;