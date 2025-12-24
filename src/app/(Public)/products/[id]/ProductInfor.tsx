"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import MeasurementsForm from "./MeasurementForm";

interface ProductInfoProps {
  product: any;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  showMeasurements: boolean;
  setShowMeasurements: (show: boolean) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  showMeasurements,
  setShowMeasurements,
}) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="w-full">
      {/* Description Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "description"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            Description
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            Details
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "shipping"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            Shipping & Returns
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-6 min-h-[200px]">
        {activeTab === "description" && (
          <div>
            <p className="text-gray-600 mb-4 whitespace-pre-line">{product.description}</p>

            {/* Show productDetails if exists in your API */}
            {product.productDetails && (
              <>
                <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
                <p className="text-gray-600">{product.productDetails}</p>
              </>
            )}

            {/* If no description, show a fallback */}
            {!product.description && !product.productDetails && (
              <p className="text-gray-500 italic">No description available for this product.</p>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-4">
            {/* Check all possible fields from your API */}
            {product.materials && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                <p className="text-gray-600">{product.materials}</p>
              </div>
            )}

            {product.attributes?.material && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Material</h4>
                <p className="text-gray-600">{product.attributes.material}</p>
              </div>
            )}

            {product.careInstructions && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Care Instructions</h4>
                <p className="text-gray-600">{product.careInstructions}</p>
              </div>
            )}

            {/* If no details, show a fallback */}
            {!product.materials && !product.attributes?.material && !product.careInstructions && (
              <p className="text-gray-500 italic">No additional details available.</p>
            )}
          </div>
        )}

        {activeTab === "shipping" && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
            <p className="text-gray-600 mb-4">
              {product.deliveryInfo ||
                "Ready to ship in 3-5 business days. Free shipping on orders over ₦50,000"}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Return Policy</h5>
              <p className="text-sm text-gray-600">
                We accept returns within 7 days of delivery. Items must be unworn, unwashed, and in
                original condition with all tags attached.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Size Selector - Always show if sizes exist */}
      {product.attributes?.sizes && product.attributes.sizes.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center justify-between">
            <span>Select Size</span>
            <Link href="/size-guide" className="text-sm text-amber-600 hover:text-amber-700">
              Size Guide
            </Link>
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.attributes.sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-md transition-all duration-200 ${
                  selectedSize === size
                    ? "border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-100"
                    : "border-gray-300 hover:border-gray-400 text-gray-700"
                }`}>
                {size}
                {selectedSize === size && <FiCheck className="inline ml-1" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector - Always show if colors exist */}
      {product.attributes?.colors && product.attributes.colors.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Available Colors</h3>
          <div className="flex flex-wrap gap-3">
            {product.attributes.colors.map((color: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color.hexCode)}
                className={`flex flex-col items-center group ${
                  selectedColor === color.hexCode ? "ring-2 ring-amber-500 ring-offset-2" : ""
                }`}>
                <div
                  className={`w-10 h-10 rounded-full border-2 transition-transform duration-200 ${
                    selectedColor === color.hexCode
                      ? "border-amber-500 scale-110"
                      : "border-gray-300 group-hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.hexCode }}
                  title={color.name}
                />
                <span
                  className={`text-xs mt-1 ${
                    selectedColor === color.hexCode ? "text-amber-600 font-medium" : "text-gray-600"
                  }`}>
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector - Always show */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity <= 1}>
            -
          </button>
          <div className="w-16 h-10 flex items-center justify-center border-y border-gray-300 bg-white">
            {quantity}
          </div>
          <button
            onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity >= (product.stock || 1)}>
            +
          </button>
          <span className="ml-4 text-sm text-gray-500">Max: {product.stock || 1} items</span>
        </div>
      </div>

      {/* Custom Measurements */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <button
          onClick={() => setShowMeasurements(!showMeasurements)}
          className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
          {showMeasurements ? "Hide Custom Measurements" : "Need Custom Measurements?"}
          <svg
            className={`ml-1 w-4 h-4 transition-transform ${showMeasurements ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMeasurements && (
          <div className="mt-4">
            <MeasurementsForm
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              quantity={quantity}
            />
          </div>
        )}
      </div>
      {/* SKU & Category */}
      <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="font-medium text-gray-700">SKU:</span> {product.sku || "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-700">Category:</span> {product.category || "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-700">Type:</span> {product.type || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
