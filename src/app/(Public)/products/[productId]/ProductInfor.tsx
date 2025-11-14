import Link from "next/link";
import React from "react";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { FiShare2 } from "react-icons/fi";
import MeasurementsForm from "./MeasurementForm";

const ProductInfor = ({
  showMeasurements,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  mockProduct,
  setShowMeasurements,
}: any) => {
  return (
    <div className="w-full lg:w-1/2 p-4 md:p-8">
      <div className="flex justify-between items-start mb-2">
        <Link
          href={`/stylists/${mockProduct.stylist.toLowerCase().replace(/\s+/g, "-")}`}
          className="text-amber-600 hover:text-amber-700 font-medium">
          {mockProduct.stylist}
        </Link>
        <div className="flex gap-3">
          <button title="share" className="text-gray-400 hover:text-gray-600">
            <FiShare2 size={20} />
          </button>
          {/* <WishlistBtn product={mockProduct} /> */}
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{mockProduct.name}</h1>

      {/* Rating */}
      <div className="flex items-center mb-4">
        <div className="flex mr-2">
          {[...Array(5)].map((_, i) => {
            if (i < Math.floor(mockProduct.rating)) {
              return <BsStarFill key={i} className="text-amber-400" />;
            }
            if (i === Math.floor(mockProduct.rating) && mockProduct.rating % 1 >= 0.5) {
              return <BsStarHalf key={i} className="text-amber-400" />;
            }
            return <BsStarFill key={i} className="text-gray-300" />;
          })}
        </div>
        <span className="text-sm text-gray-500">
          {mockProduct.rating} ({mockProduct.reviews} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="mb-6">
        {mockProduct.maxPrice > mockProduct.minPrice ? (
          <>
            <span className="text-2xl font-bold text-gray-900">
              ₦{mockProduct.minPrice.toLocaleString()} - ₦{mockProduct.maxPrice.toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-gray-500">(Price varies by customization)</span>
          </>
        ) : (
          <span className="text-2xl font-bold text-gray-900">
            ₦{mockProduct.minPrice.toLocaleString()}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Description</h3>
        <p className="text-gray-600">{mockProduct.productDetails}</p>
      </div>

      {/* Materials & Care */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Materials</h3>
          <p className="text-gray-600">{mockProduct.materials}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Care Instructions</h3>
          <p className="text-gray-600">{mockProduct.careInstructions}</p>
        </div>
      </div>

      {/* Size Selector */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Select Size</h3>
        <div className="flex flex-wrap gap-2">
          {mockProduct.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 border rounded-md ${
                selectedSize === size
                  ? "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selector */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Available Colors</h3>
        <div className="flex flex-wrap gap-3">
          {mockProduct.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? "border-amber-500" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-gray-50 p-3 rounded-lg mb-6">
        <p className="text-sm text-gray-600">{mockProduct.deliveryInfo}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* <AddCartButton product={mockProduct} />
      <BuyButton product={mockProduct} /> */}
      </div>

      {/* Custom Measurements */}
      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={() => setShowMeasurements(!showMeasurements)}
          className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
          {showMeasurements ? "Hide" : "Need Custom Measurements?"}
          <svg
            className={`ml-1 w-4 h-4 transition-transform ${showMeasurements ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        {showMeasurements && (
          <div className="mt-4">
            <MeasurementsForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfor;
