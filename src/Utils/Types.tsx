export interface Product {
  _id?: string;
  name: string;
  price: number;
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
  status?: "draft" | "published" | "archived";
  isAdminApproved?: boolean;
  stylist?: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
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
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  count: number;
  total: number;
  page: number;
  pages: number;
}
