"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { FiShoppingBag, FiTrash2, FiHeart, FiX, FiChevronLeft } from "react-icons/fi";
import {
  useClearCartMutation,
  useGetCartProductsQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} from "@/redux/services/CartApiSlice";
import toast from "react-hot-toast";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";
import { useMoveToCartMutation } from "@/redux/services/WishlistApiSlice";

interface CartProduct {
  id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    mainImage: string;
    stock: number;
  };
  quantity: number;
  price: number;
}

const CartPage = () => {
  const { data: cartData, isLoading, isError, error, refetch } = useGetCartProductsQuery(null);
  const [removeFromCart] = useRemoveFromCartMutation();
  const [moveToWishlist] = useMoveToCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [clearCart] = useClearCartMutation();
  console.log(cartData);
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Failed to load cart");
    }
  }, [isError, error]);

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId).unwrap();
      toast.success("Product removed from cart");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove product");
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await updateCart({ productId, quantity }).unwrap();
      toast.success("Cart updated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update quantity");
    }
  };

  const handleMoveToWishlist = (productId: string) => {
    // TODO: Implement wishlist functionality
    toast.success("Wishlist functionality coming soon");
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    // toast.info("Proceeding to checkout");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const cartProducts = cartData?.data?.items || [];
  const subtotal = cartData?.total || 0;
  const shipping = 2500;
  const tax = 1200;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiShoppingBag className="text-amber-500" />
          My Shopping Cart
        </h1>
        <p className="text-gray-600 mt-1">
          {cartProducts.length} {cartProducts.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {cartProducts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartProducts.map((product: CartProduct) => (
              <CartItem
                key={product.product._id}
                product={product}
                onRemove={handleRemove}
                onUpdateQuantity={handleUpdateQuantity}
                onMoveToWishlist={handleMoveToWishlist}
              />
            ))}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2">
                <FiTrash2 /> Clear Cart
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₦{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₦{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-amber-600">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-colors">
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center text-sm text-gray-500">
              or{" "}
              <Link href="/products" className="text-amber-600 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default CartPage;
