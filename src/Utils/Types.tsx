export interface Product {
  _id?: string;
  name: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  description: string;
  category: "men" | "women" | "unisex" | "material";
  type: "native" | "corporate" | "casual" | "traditional";
  mainImage: string;
  subImages?: string[];
  stock: number;
  attributes?: {
    color?: string;
    size?: string;
    material?: string;
  };
  productDetails?: string;
  materials?: string;
  careInstructions?: string;
  deliveryInfo?: string;
  status?: "draft" | "published" | "archived";
  isAdminApproved?: boolean;
  stylist?: string;
  stylistName?: string;
  sku?: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  description: string;
  stylist?: string;
  stylistName?: string;
  category: "men" | "women" | "unisex" | "material";
  type: "native" | "corporate" | "casual" | "traditional";
  mainImage: string;
  subImages?: string[];
  stock: number;
  attributes?: {
    color?: string;
    size?: string;
    material?: string;
  };
  productDetails?: string;
  materials?: string;
  careInstructions?: string;
  deliveryInfo?: string;
  status?: "draft"; // Add status field
}
