"use client";

import { useState } from "react";
import { FiFileText, FiPackage, FiTruck, FiMessageSquare } from "react-icons/fi";
import ReviewsSection from "./ReviewsSection";

interface ProductTabsProps {
  product: any;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description", icon: <FiFileText /> },
    { id: "details", label: "Product Details", icon: <FiPackage /> },
    { id: "delivery", label: "Delivery & Returns", icon: <FiTruck /> },
    { id: "reviews", label: "Reviews", icon: <FiMessageSquare /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}>
              {tab.icon}
              {tab.label}
              {tab.id === "reviews" && product.reviewCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
                  {product.reviewCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "description" && (
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-4">Product Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>

            {product.materials && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Materials & Care</h4>
                <p className="text-gray-700">{product.materials}</p>
              </div>
            )}

            {product.careInstructions && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Care Instructions</h4>
                <p className="text-gray-700">{product.careInstructions}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>

            {product.productDetails && (
              <p className="text-gray-700 whitespace-pre-line">{product.productDetails}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Specifications</h4>
                <dl className="space-y-2">
                  {product.category && (
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Category:</dt>
                      <dd className="font-medium capitalize">{product.category}</dd>
                    </div>
                  )}
                  {product.type && (
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Type:</dt>
                      <dd className="font-medium capitalize">{product.type}</dd>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex">
                      <dt className="w-32 text-gray-600">SKU:</dt>
                      <dd className="font-medium">{product.sku}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Attributes</h4>
                <dl className="space-y-2">
                  {product.attributes?.size && (
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Size:</dt>
                      <dd className="font-medium">{product.attributes.size}</dd>
                    </div>
                  )}
                  {product.attributes?.color && (
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Color:</dt>
                      <dd className="font-medium capitalize">{product.attributes.color}</dd>
                    </div>
                  )}
                  {product.attributes?.material && (
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Material:</dt>
                      <dd className="font-medium">{product.attributes.material}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === "delivery" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Delivery & Returns</h3>

            {product.deliveryInfo ? (
              <p className="text-gray-700 whitespace-pre-line">{product.deliveryInfo}</p>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Standard Delivery</h4>
                  <p className="text-blue-700">
                    • Free delivery on orders over ₦50,000
                    <br />
                    • 3-5 business days within Lagos
                    <br />• 5-7 business days nationwide
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Express Delivery</h4>
                  <p className="text-green-700">
                    • ₦2,500 flat rate
                    <br />
                    • 1-2 business days within Lagos
                    <br />• 2-3 business days nationwide
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-2">Returns Policy</h4>
                  <p className="text-amber-700">
                    • 30-day return policy
                    <br />
                    • Items must be unused with original tags
                    <br />• Free returns for defective items
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <ReviewsSection
            reviews={product.reviews || []}
            averageRating={product.rating || 0}
            productId={product._id}
          />
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
