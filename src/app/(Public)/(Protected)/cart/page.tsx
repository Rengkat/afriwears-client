"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { FiShoppingBag, FiTrash2, FiChevronLeft } from "react-icons/fi";
import {
  useClearCartMutation,
  useGetCartProductsQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
  useMoveToWishlistMutation,
} from "@/redux/services/CartApiSlice";
import toast from "react-hot-toast";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";

interface CartProduct {
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
}

const CartPage = () => {
  const {
    data: cartData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCartProductsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [clearCart] = useClearCartMutation();
  const [moveToWishlist] = useMoveToWishlistMutation();

  useEffect(() => {
    if (isError) {
      const errorMessage = (error as any)?.data?.message || "Failed to load cart";
      toast.error(errorMessage);
    }
  }, [isError, error]);

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId).unwrap();
      toast.success("Product removed from cart");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove product");
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    console.log(productId);
    try {
      await updateCart({ productId, quantity }).unwrap();
      toast.success("Cart updated successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update quantity");
    }
  };

  const handleMoveToWishlist = async (productId: string) => {
    try {
      await moveToWishlist(productId).unwrap();
      toast.success("Moved to wishlist successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to move to wishlist");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your entire cart?")) {
      return;
    }

    try {
      await clearCart().unwrap();
      toast.success("Cart cleared successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to clear cart");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const cartProducts = cartData?.data?.items || [];
  console.log(cartData);
  const subtotal = cartData?.data?.total || 0;
  const shipping = subtotal > 0 ? 2500 : 0; // Free shipping on empty cart
  const tax = subtotal > 0 ? Math.round(subtotal * 0.075) : 0; // 7.5% VAT
  const total = subtotal + shipping + tax;

  if (cartProducts.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/products"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <FiChevronLeft className="mr-1" />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiShoppingBag className="text-amber-500" />
          My Shopping Cart
        </h1>
        <p className="text-gray-600 mt-1">
          {cartProducts.length} {cartProducts.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartProducts.map((product: CartProduct) => {
            return (
              <CartItem
                key={product.product._id}
                product={product}
                onRemove={handleRemove}
                onUpdateQuantity={handleUpdateQuantity}
                onMoveToWishlist={handleMoveToWishlist}
              />
            );
          })}

          {/* Clear Cart Button */}
          <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Need to start over?</p>
            <button
              onClick={handleClearCart}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
              <FiTrash2 /> Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartProducts.length} items)</span>
                <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">
                  {shipping === 0 ? "FREE" : `₦${shipping.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax (7.5%)</span>
                <span className="font-medium text-gray-900">₦{tax.toLocaleString()}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-amber-600">₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/account/user/checkout"
              className="block w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-center font-medium rounded-lg shadow-sm transition-colors mb-3">
              Proceed to Checkout
            </Link>

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-500 mb-4">
              Taxes and shipping calculated at checkout
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure checkout</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Free returns within 30 days</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Fast & reliable shipping</span>
              </div>
            </div>

            {/* Continue Shopping Link */}
            <div className="mt-4 text-center">
              <Link
                href="/products"
                className="text-sm text-amber-600 hover:text-amber-700 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
