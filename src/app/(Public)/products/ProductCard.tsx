"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsHeart, BsHeartFill, BsEye, BsStarFill, BsStar, BsTag } from "react-icons/bs";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Here you would typically make an API call to update wishlist
  };

  // Format price to Nigerian Naira
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get product link based on slug or ID
  const getProductLink = () => {
    return product.slug ? `/products/${product.slug}` : `/products/${product.id}`;
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <BsStarFill key={i} className="w-3 h-3 text-amber-400" />
        ) : (
          <BsStar key={i} className="w-3 h-3 text-gray-300" />
        ),
      );
    }
    return stars;
  };

  // Check if product is new (less than 7 days old)
  const isProductNew = () => {
    if (product.isNewProduct) return true;
    const createdAt = new Date(product.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    return diffDays < 7;
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case "men":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "women":
        return "bg-pink-50 text-pink-700 border-pink-200";
      case "unisex":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "material":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Link href={getProductLink()} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          {/* Product Image */}
          <Image
            src={product.mainImage || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 ">
            {isProductNew() && (
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
                NEW
              </span>
            )}
            {product.featured && (
              <span className="bg-amber-600 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
                FEATURED
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
                BEST SELLER
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition-all z-10 ${
              isWishlisted ? "text-red-500" : "text-gray-700 hover:text-red-500 hover:scale-110"
            }`}>
            {isWishlisted ? <BsHeartFill size={18} /> : <BsHeart size={18} />}
          </button>

          {/* Stock Badge */}
          {product.stock <= 0 ? (
            <span className="absolute bottom-3 left-3 bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              SOLD OUT
            </span>
          ) : (
            product.stock <= 5 && (
              <span className="absolute bottom-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                {product.stock} LEFT
              </span>
            )
          )}

          {/* Quick View Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium flex items-center gap-2 transform transition-transform hover:scale-105">
              <BsEye size={16} /> Quick View
            </div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category Badge */}
          <div className="mb-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                product.category,
              )}`}>
              <BsTag className="w-3 h-3 mr-1" />
              {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)}
            </span>
            {product.type && (
              <span className="ml-2 text-xs text-gray-500 font-medium">
                • {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">{product.name}</h3>

          {/* Stylist Name */}
          {product.stylistName && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-1">
              By <span className="font-medium">{product.stylistName}</span>
            </p>
          )}

          {/* Material - Only show if available */}
          {product.attributes?.material && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-1">
              Material: <span className="font-medium">{product.attributes.material}</span>
            </p>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            {/* Price */}
            <div>
              <span className="font-bold text-lg text-gray-900">{formatPrice(product.price)}</span>
              {product.stock > 0 && (
                <p className="text-xs text-green-600 font-medium mt-1">✓ In Stock</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <div className="flex">{renderRating(product.rating || 0)}</div>
                <span className="text-xs text-gray-900 font-medium">
                  {product.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
              {product.reviewCount > 0 && (
                <span className="text-xs text-gray-500 mt-1">
                  {product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status Bar */}
          {product.stock > 0 && product.stock <= 20 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Stock</span>
                <span>{product.stock} remaining</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    product.stock > 10
                      ? "bg-green-500"
                      : product.stock > 5
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${(product.stock / 20) * 100}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
