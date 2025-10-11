import Link from "next/link";
import React from "react";
import { FiChevronLeft, FiShoppingBag } from "react-icons/fi";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-amber-50 p-6 rounded-full mb-6">
        <FiShoppingBag className="text-amber-600 text-4xl" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
      <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
      <Link
        href="/products"
        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2">
        <FiChevronLeft /> Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
