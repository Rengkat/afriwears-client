"use client";
import { FiHeart, FiShoppingBag, FiTrash2, FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  useGetMyWishlistQuery,
  useMoveToCartMutation,
  useRemoveFromWishlistMutation,
} from "@/redux/services/WishlistApiSlice";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === "object" && error !== null && "status" in error;
};
const WishlistPage = () => {
  const { data: wishlistData, isLoading, isError, error, refetch } = useGetMyWishlistQuery();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
  const [moveToCart, { isLoading: isMovingToCart }] = useMoveToCartMutation();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [movingToCartId, setMovingToCartId] = useState<string | null>(null);

  const wishlist = wishlistData?.items || [];

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success("Item removed from wishlist");
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      toast.error("Failed to remove item from wishlist");
    } finally {
      setRemovingId(null);
    }
  };

  const handleMoveToCart = async (productId: string) => {
    setMovingToCartId(productId);
    try {
      await moveToCart(productId).unwrap();
      toast.success("Item moved to cart successfully");
    } catch (err) {
      console.error("Failed to move to cart:", err);
      toast.error("Failed to move item to cart");
    } finally {
      setMovingToCartId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiHeart className="text-amber-500" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-1">Loading your wishlist...</p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="h-24 w-24 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiHeart className="text-amber-500" />
            My Wishlist
          </h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto h-24 w-24 text-red-500 mb-4">
            <FiAlertCircle className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading wishlist</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {isFetchBaseQueryError(error)
              ? (error.data as any)?.message
              : "We couldn't load your wishlist. Please try again."}
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiHeart className="text-amber-500" />
          My Wishlist
        </h1>
        <p className="text-gray-600 mt-1">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
            <FiHeart className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Save items you love by clicking the heart icon. They'll appear here for easy access.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
            <FiShoppingBag className="mr-2" />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 md:p-6 flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="h-32 w-32 rounded-md overflow-hidden relative">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
                      }}
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1">{item.productName}</h3>
                  <p className="text-sm text-gray-500 mb-2">By {item.stylist}</p>
                  <p className="font-medium text-amber-600">₦{item.price.toLocaleString()}</p>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 sm:justify-center">
                  <button
                    onClick={() => handleMoveToCart(item.productId)}
                    disabled={isMovingToCart && movingToCartId === item.productId}
                    className={`flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 ${
                      isMovingToCart && movingToCartId === item.productId ? "opacity-70" : ""
                    }`}>
                    <FiShoppingBag size={16} />
                    <span className="hidden sm:inline">
                      {isMovingToCart && movingToCartId === item.productId
                        ? "Moving..."
                        : "Add to Cart"}
                    </span>
                  </button>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={isRemoving && removingId === item.productId}
                    className={`flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 ${
                      isRemoving && removingId === item.productId ? "opacity-70" : ""
                    }`}>
                    <FiTrash2 size={16} />
                    <span className="hidden sm:inline">
                      {isRemoving && removingId === item.productId ? "Removing..." : "Remove"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
