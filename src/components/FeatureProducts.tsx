"use client";
import Image from "next/image";
import Link from "next/link";
import { BsArrowRight, BsStarFill, BsStarHalf } from "react-icons/bs";
import { motion } from "framer-motion";
import { useGetApprovedProductsQuery } from "@/redux/services/ProductApi";

interface Product {
  _id: string;
  id?: string; // Optional in case API returns id instead of _id
  name: string;
  slug: string;
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
  attributes?: {
    colors?: Array<{
      name: string;
      hexCode: string;
    }>;
    sizes?: string[];
    material?: string;
  };
  stylist: string | { _id: string; businessName?: string; name?: string };
  stylistName?: string;
  rating: number;
  reviews: Array<{
    user: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  reviewCount: number;
  isBestSeller?: boolean;
  isNewProduct?: boolean;
  featured?: boolean;
  isAdminApproved?: boolean;
  createdBy?: "stylist" | "admin";
  approvedBy?: string;
  rejectionReason?: string;
  stock: number;
  sku?: string;
  category: "men" | "women" | "unisex" | "material";
  type: "native" | "corporate" | "casual" | "traditional";
  tags?: string[];
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

const FeaturedProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.6 }}
      className="relative group overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {product.isBestSeller && (
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            BESTSELLER
          </span>
        )}
        {product.isNewProduct && (
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            NEW
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src={product.mainImage || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
          <div className="flex flex-col items-end">
            <span className="font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
            {product.minPrice && product.maxPrice && product.minPrice < product.maxPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₦{product.maxPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-1">
          {product.stylistName ||
            (typeof product.stylist === "object"
              ? product.stylist?.businessName || product.stylist?.name
              : product.stylist) ||
            "Unknown Stylist"}
        </p>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => {
              if (i < Math.floor(product.rating)) {
                return <BsStarFill key={i} size={14} />;
              }
              if (i === Math.floor(product.rating) && product.rating % 1 >= 0.5) {
                return <BsStarHalf key={i} size={14} />;
              }
              return <BsStarFill key={i} size={14} className="text-gray-300" />;
            })}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Color Options */}
        {product.attributes?.colors && product.attributes.colors.length > 0 && (
          <div className="flex gap-2 mb-5">
            {product.attributes.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.hexCode || color.name }}
                title={color.name}
              />
            ))}
            {product.attributes.colors.length > 4 && (
              <span className="text-xs text-gray-500 self-center">
                +{product.attributes.colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Link href={`/products/${product._id || product.id}`}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors">
            View Details
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

//

const FeaturedProducts = () => {
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useGetApprovedProductsQuery({
    page: 1,
    limit: 4,
    featured: true,
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Featured Collections
            </h2>
            <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full mb-6" />
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Carefully curated selection of our most premium African fashion pieces, loved by
              customers and crafted by master artisans
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-xl shadow-lg">
                <div className="h-80 bg-gray-200 rounded-t-xl"></div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between">
                    <div className="bg-gray-200 h-5 rounded w-2/3"></div>
                    <div className="bg-gray-200 h-5 rounded w-1/4"></div>
                  </div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  <div className="bg-gray-200 h-12 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Featured Collections
            </h2>
            <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full mb-6" />
            <p className="text-lg text-red-600 max-w-3xl mx-auto">
              Unable to load featured products. Please try again later.
            </p>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors">
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Extract products from API response
  const products = productsData?.data?.products || productsData?.products || [];

  // Transform API data
  const transformProductData = (product: any): Product => {
    return {
      _id: product._id || product.id,
      id: product.id || product._id,
      name: product.name,
      slug: product.slug || `product-${product._id || product.id}`,
      description: product.description || "Premium African fashion piece",
      productDetails: product.productDetails,
      materials: product.materials,
      careInstructions: product.careInstructions,
      deliveryInfo: product.deliveryInfo,
      price: product.price || 0,
      minPrice: product.minPrice,
      maxPrice: product.maxPrice,
      mainImage: product.mainImage || product.images?.[0] || "/placeholder-product.jpg",
      subImages: product.subImages || product.images?.slice(1),
      attributes: product.attributes || {
        colors: [
          { name: "Indigo", hexCode: "#4B0082" },
          { name: "Crimson", hexCode: "#DC143C" },
          { name: "Gold", hexCode: "#FFD700" },
        ],
      },
      stylist: product.stylist,
      stylistName:
        product.stylistName ||
        product.stylist?.businessName ||
        product.stylist?.name ||
        "Unknown Stylist",
      rating: product.rating || 4.5,
      reviews: product.reviews || [],
      reviewCount: product.reviewCount || product.reviews?.length || 0,
      isBestSeller: product.isBestSeller || false,
      isNewProduct: product.isNewProduct || false,
      featured: product.featured,
      isAdminApproved: product.isAdminApproved,
      createdBy: product.createdBy,
      approvedBy: product.approvedBy,
      rejectionReason: product.rejectionReason,
      stock: product.stock || 0,
      sku: product.sku,
      category: product.category || "unisex",
      type: product.type || "casual",
      tags: product.tags,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  };

  const featuredProducts = products.slice(0, 4).map(transformProductData);

  // If no featured products found
  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Featured Collections
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto">
              No featured products available at the moment. Check back soon!
            </motion.p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Featured Collections
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto">
            Carefully curated selection of our most premium African fashion pieces, loved by
            customers and crafted by master artisans
          </motion.p>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product: Product) => (
            <FeaturedProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* View All Button - Only show if there are products */}
        {featuredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-16">
            <Link href="/products?featured=true">
              <button className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                Browse All Featured Items
                <BsArrowRight size={18} />
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
