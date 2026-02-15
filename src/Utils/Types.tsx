export interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  mainImage: string;
  subImages: string[];
  category: string;
  type: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  isBestSeller?: boolean;
  isNewProduct?: boolean;
  stock: number;
  sku?: string;
  slug: string;
  attributes: Record<string, any>;
  stylist: any;
  stylistName?: string;
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  isNew: boolean;
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
