export interface ProductReview {
  user: string;
  name?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ProductAttributes {
  colors?: { name?: string; hexCode?: string }[];
  sizes?: string[];
  material?: string;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  description: string;
  productDetails?: string;
  materials?: string;
  careInstructions?: string;
  deliveryInfo?: string;

  price: number;
  minPrice?: number;
  maxPrice?: number;

  mainImage: string;
  subImages?: string[];

  attributes?: ProductAttributes;

  stylist: string;
  stylistName?: string;

  rating: number;
  reviews?: ProductReview[];
  reviewCount: number;

  isBestSeller?: boolean;
  isNewProduct?: boolean;
  featured?: boolean;
  isAdminApproved?: boolean;
  createdBy?: "stylist" | "admin";
  approvedBy?: string;
  rejectionReason?: string;
  isNew?: boolean;

  stock: number;
  sku?: string;

  category: "men" | "women" | "unisex" | "material";
  type: "native" | "corporate" | "casual" | "traditional";
  tags?: string[];

  status: "pending" | "approved" | "rejected";

  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  category: "men" | "women" | "unisex" | "material";
  type: "native" | "corporate" | "casual" | "traditional";
  description: string;
  stock: number;
  featured?: boolean;
  isBestSeller?: boolean;
  isNewProduct?: boolean;
  attributes?: {
    colors?: Array<{ name: string; hexCode: string }>;
    sizes?: string[];
    material?: string;
  };
  mainImage: string;
  subImages?: string[];
  productDetails?: string;
  careInstructions?: string;
  deliveryInfo?: string;
  status?: "draft" | "published";
  stylist?: string;
  stylistName?: string;
}
