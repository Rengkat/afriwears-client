// components/ProductTabs.tsx - Updated for stylist view
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiInfo,
  FiPackage,
  FiTruck,
  FiMessageSquare,
  FiSettings,
  FiBarChart,
} from "react-icons/fi";

interface ProductTabsProps {
  product: any;
  isOwner?: boolean;
}

const ProductTabs = ({ product, isOwner = true }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");
  const router = useRouter();

  const tabs = [
    { id: "description", label: "Description", icon: <FiInfo /> },
    { id: "details", label: "Product Details", icon: <FiPackage /> },
    { id: "shipping", label: "Shipping & Returns", icon: <FiTruck /> },
    { id: "reviews", label: "Reviews", icon: <FiMessageSquare /> },
  ];

  // Add management tabs for owner
  if (isOwner) {
    tabs.push(
      { id: "management", label: "Management", icon: <FiSettings /> },
      { id: "performance", label: "Performance", icon: <FiBarChart /> }
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-amber-600 border-b-2 border-amber-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "description" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {product.productDetails || "No additional details provided."}
              </p>
            </div>

            {/* Attributes Section */}
            {(product.attributes?.colors?.length > 0 ||
              product.attributes?.sizes?.length > 0 ||
              product.attributes?.material) && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Attributes</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Colors */}
                  {product.attributes?.colors?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Colors</h5>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.colors.map((color: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hexCode || color }}
                            />
                            <span className="text-sm text-gray-700">{color.name || color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  {product.attributes?.sizes?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Sizes</h5>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.sizes.map((size: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Material */}
                  {product.attributes?.material && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Material</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">{product.attributes.material}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Care Instructions */}
            {product.careInstructions && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Care Instructions</h4>
                <p className="text-gray-700 whitespace-pre-line">{product.careInstructions}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping & Delivery</h3>
            {product.deliveryInfo ? (
              <p className="text-gray-700 whitespace-pre-line">{product.deliveryInfo}</p>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">Standard Shipping</h4>
                  <p className="text-blue-700">Delivery within 3-7 business days</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">Express Shipping</h4>
                  <p className="text-green-700">Delivery within 1-3 business days</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review: any, index: number) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <span className="font-medium text-gray-900">
                          {review.name || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? "text-amber-500" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No reviews yet.</p>
            )}
          </div>
        )}

        {activeTab === "management" && isOwner && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Management</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Product Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium capitalize">{product.status}</span>
                  </div>
                </div>
              </div>

              {/* Inventory Management */}

              <div className="p-4 bg-amber-50 rounded-lg">
                <h4 className="font-medium text-amber-900 mb-3">Inventory</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-amber-700">Current Stock</span>
                      <span className="font-medium">{product.stock} units</span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full"
                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                  {product.stock < 10 && (
                    <div className="text-sm text-amber-700">⚠️ Low stock alert</div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Quick Actions</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = `/account/stylist/products/edit/${product._id}`)
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  Edit Product
                </button>
                {product.status === "pending" && (
                  <button
                    type="button"
                    // onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                    Delete Product
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => router.push(`/account/stylist/products?duplicate=${product._id}`)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium">
                  Duplicate Product
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "performance" && isOwner && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {product.rating?.toFixed(1) || "0.0"}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{product.reviewCount || 0}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{product.stock}</div>
                <div className="text-sm text-gray-600">Units in Stock</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ₦{product.price?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Price</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Performance Insights</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Product was created on {new Date(product.createdAt).toLocaleDateString()}</li>
                <li>• Last updated on {new Date(product.updatedAt).toLocaleDateString()}</li>
                {product.status === "approved" && (
                  <li>• Product is live and visible to customers</li>
                )}
                {product.status === "pending" && <li>• Product is awaiting admin approval</li>}
                {product.featured && <li>• This product is marked as Featured</li>}
                {product.isBestSeller && <li>• This product is marked as Best Seller</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
