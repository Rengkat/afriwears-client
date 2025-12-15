"use client";

import { FiShoppingCart, FiCreditCard, FiLock } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProductActionsProps {
  product: any;
  quantity: number;
  selectedSize: string | null;
  selectedColor: string | null;
  isOutOfStock: boolean;
}

const ProductActions = ({
  product,
  quantity,
  selectedSize,
  selectedColor,
  isOutOfStock,
}: ProductActionsProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    setIsAddingToCart(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.mainImage,
    };

    // Here you would dispatch to Redux or call API
    console.log("Adding to cart:", cartItem);

    toast.success(`Added ${quantity} × "${product.name}" to cart`);
    setIsAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    setIsBuyingNow(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to checkout
    console.log("Proceeding to checkout");

    toast.success("Redirecting to checkout...");
    setIsBuyingNow(false);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}>
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Adding...
            </>
          ) : (
            <>
              <FiShoppingCart size={20} />
              Add to Cart
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock || isBuyingNow}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-black text-white"
          }`}>
          {isBuyingNow ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <FiCreditCard size={20} />
              Buy Now
            </>
          )}
        </button>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <FiLock size={16} />
        <span>Secure checkout powered by Stripe</span>
      </div>

      {/* Additional Info */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Category:</span>
            <span className="ml-2 font-medium capitalize">{product.category}</span>
          </div>
          <div>
            <span className="text-gray-500">Type:</span>
            <span className="ml-2 font-medium capitalize">{product.type}</span>
          </div>
          <div>
            <span className="text-gray-500">SKU:</span>
            <span className="ml-2 font-medium">{product.sku}</span>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <span
              className={`ml-2 font-medium capitalize ${
                product.status === "approved"
                  ? "text-green-600"
                  : product.status === "pending"
                  ? "text-amber-600"
                  : product.status === "rejected"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}>
              {product.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductActions;
