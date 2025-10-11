"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsHeart, BsHeartFill, BsEye, BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically make an API call to update wishlist
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="relative overflow-hidden rounded-xl bg-gray-50 h-80">
        {/* Product Image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm transition-all ${
            isWishlisted ? "text-red-500" : "text-gray-700 hover:text-red-500"
          }`}>
          {isWishlisted ? <BsHeartFill size={20} /> : <BsHeart size={20} />}
        </button>

        {/* Quick View Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          className=" absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Link href={`/products/${product.slug}`}>
            <button className="cursor-pointer w-full flex items-center gap-2 bg-white text-gray-900 px-6 py-2 rounded-full font-medium shadow-lg hover:bg-gray-100 transition-all">
              <BsEye size={18} /> Quick View
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.stylist}</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
        </div>

        {/* Color Options */}
        <div className="flex gap-2 mt-3">
          {product.colors.map((color) => (
            <div
              key={color}
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
