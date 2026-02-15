"use client";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useGetApprovedProductsQuery } from "@/redux/services/ProductApi";

const RecentProducts = () => {
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useGetApprovedProductsQuery({
    page: 1,
    limit: 8,
    category: "women",
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Ladies' Collections
            </h2>
            <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full" />
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our newest African-inspired designs that blend tradition with contemporary
              fashion
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  <div className="flex justify-between">
                    <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                  </div>
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
    console.error("Error loading products:", error);
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Ladies' Collections
            </h2>
            <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full" />
            <p className="mt-6 text-lg text-red-600 max-w-2xl mx-auto">
              Unable to load products. Please try again later.
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

  // If no products found
  if (products.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Ladies' Collections
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              No ladies' products available at the moment. Check back soon!
            </motion.p>
          </div>
        </div>
      </section>
    );
  }

  // Transform API data to match ProductCard expected format
  const transformProductData = (product: any) => {
    return {
      id: product._id || product.id,
      name: product.name,
      slug: product.slug || `product-${product._id || product.id}`,
      image: product.mainImage || product.images?.[0] || "/placeholder-product.jpg",
      price: product.price || 0,
      originalPrice: product.originalPrice || product.price * 1.2, // 20% markup for display
      discountPercentage:
        product.discountPercentage ||
        (product.originalPrice && product.price
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0),
      stylist:
        product.stylistName ||
        product.stylist?.businessName ||
        product.stylist?.name ||
        "Unknown Stylist",
      colors: product.attributes?.colors?.map((c: any) => c.name) ||
        product.attributes?.colors?.map((c: any) => c.hexCode) || ["indigo", "crimson", "gold"],
      sizes: product.attributes?.sizes || ["S", "M", "L", "XL"],
      rating: product.rating || product.averageRating || 4.5,
      reviews: product.reviewCount || product.reviews?.length || 0,
      isNew: product.isNewProduct || false,
      isFeatured: product.featured || false,
      category: product.category,
      type: product.type,
      stock: product.stock || 0,
      isBestSeller: product.isBestSeller || false,
      tags: product.tags || [],
    };
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Ladies' Collections
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our newest African-inspired designs that blend tradition with contemporary
            fashion
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product: any) => (
            <ProductCard key={product._id || product.id} product={transformProductData(product)} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12">
          <Link href="/products/ladies">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors">
              View All Ladies' Wear
              <BsArrowRight size={18} />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentProducts;
