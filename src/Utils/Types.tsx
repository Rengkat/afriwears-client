export interface Product {
  _id: string;
  id?: string;
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
  category: "men" | "women" | "unisex" | "material";
  type: "native" | "corporate" | "casual" | "traditional";
  description: string;
  stock: number;
  featured?: boolean;
  isBestSeller?: boolean;
  isNewProduct?: boolean;
  attributes?: {
    colors?: Array<{ name: string; hexCode: string }>; // ← plural
    sizes?: string[]; // ← plural
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
