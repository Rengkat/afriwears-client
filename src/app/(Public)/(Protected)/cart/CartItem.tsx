"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiHeart, FiMinus, FiPlus } from "react-icons/fi";

interface CartItemProps {
  product: {
    id: string;
    product: {
      _id: string;
      name: string;
      price: number;
      mainImage: string;
      stock: number;
      category?: string;
    };
    quantity: number;
    price: number;
    selectedSize?: string;
    selectedColor?: string;
  };
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onMoveToWishlist: (productId: string) => void;
}

const CartItem = ({ product, onRemove, onUpdateQuantity, onMoveToWishlist }: CartItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(product.quantity);
  // console.log(product);
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > product.product.stock) return;

    setIsUpdating(true);
    setLocalQuantity(newQuantity);

    try {
      await onUpdateQuantity(product.product._id, newQuantity);
    } catch (error) {
      // Revert on error
      setLocalQuantity(product.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const incrementQuantity = () => {
    if (localQuantity < product.product.stock) {
      handleQuantityChange(localQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (localQuantity > 1) {
      handleQuantityChange(localQuantity - 1);
    }
  };

  const isOutOfStock = product.product.stock === 0;
  const isLowStock = product.product.stock > 0 && product.product.stock < 5;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link
          href={`/products/${product.product._id}`}
          className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.product.mainImage}
            alt={product.product.name}
            width={128}
            height={128}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-grow pr-4">
              <Link
                href={`/products/${product.product._id}`}
                className="font-semibold text-gray-900 hover:text-amber-600 transition-colors line-clamp-2 mb-1">
                {product.product.name}
              </Link>

              {product.product.category && (
                <p className="text-xs text-gray-500 capitalize">{product.product.category}</p>
              )}

              {/* Size and Color */}
              <div className="flex gap-3 mt-2 text-sm">
                {product.selectedSize && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    Size: {product.selectedSize}
                  </span>
                )}
                {product.selectedColor && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    Color: {product.selectedColor}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-gray-900 text-lg">₦{product.price.toLocaleString()}</p>
              <p className="text-xs text-gray-500">per item</p>
            </div>
          </div>

          {/* Stock Status */}
          {isOutOfStock ? (
            <div className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 text-xs rounded mb-3">
              Out of Stock
            </div>
          ) : isLowStock ? (
            <div className="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded mb-3">
              Only {product.product.stock} left
            </div>
          ) : (
            <div className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded mb-3">
              In Stock
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={decrementQuantity}
                disabled={isUpdating || localQuantity <= 1 || isOutOfStock}
                className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity">
                <FiMinus size={16} />
              </button>

              <div className="px-4 py-2 min-w-[3rem] text-center font-medium border-x border-gray-300">
                {isUpdating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mx-auto"></div>
                ) : (
                  localQuantity
                )}
              </div>

              <button
                onClick={incrementQuantity}
                disabled={isUpdating || localQuantity >= product.product.stock || isOutOfStock}
                className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity">
                <FiPlus size={16} />
              </button>
            </div>

            {/* Subtotal */}
            <div className="flex-grow text-right md:text-left">
              <p className="text-sm text-gray-500">Subtotal:</p>
              <p className="font-bold text-gray-900">
                ₦{(product.price * localQuantity).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onMoveToWishlist(product.product._id)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
              <FiHeart size={16} />
              <span className="hidden sm:inline">Move to Wishlist</span>
            </button>

            <button
              onClick={() => onRemove(product.product._id)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <FiTrash2 size={16} />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
