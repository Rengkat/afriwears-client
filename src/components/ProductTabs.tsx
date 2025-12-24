"use client";
import React, { useState } from "react";
import { FiStar, FiMessageSquare, FiTruck, FiShield } from "react-icons/fi";

interface ProductTabsProps {
  product: any;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState("reviews");

  const tabs = [
    { id: "reviews", label: "Reviews & Ratings", icon: FiStar },
    { id: "stylist", label: "About Stylist", icon: FiMessageSquare },
    { id: "shipping", label: "Shipping & Returns", icon: FiTruck },
    { id: "qa", label: "Q&A", icon: FiMessageSquare },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "reviews" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${
                          star <= Math.floor(product.rating || 0)
                            ? "text-amber-400"
                            : "text-gray-300"
                        }`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {product.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-gray-500">({product.reviewCount || 0} reviews)</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-medium">
                Write a Review
              </button>
            </div>

            {/* Reviews List */}
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review: any) => (
                  <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-medium text-gray-700">
                            {review.name?.[0] || "U"}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {review.name || "Anonymous"}
                          </h4>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${
                                  star <= review.rating ? "text-amber-400" : "text-gray-300"
                                }`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                <p className="text-gray-600 mb-6">Be the first to share your thoughts!</p>
                <button className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-medium">
                  Write First Review
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "stylist" && product.stylist && (
          <div>
            <div className="flex items-start gap-6 mb-6">
              {product.stylist.avatar && (
                <img
                  src={product.stylist.avatar}
                  alt={product.stylist.companyName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.stylist.companyName}
                </h3>
                <p className="text-gray-600 mb-4">{product.stylist.description}</p>
                <div className="flex flex-wrap gap-2">
                  {product.stylist.specialty?.map((specialty: string) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <p className="text-gray-600">
                  {product.stylist.location?.address || "Address not specified"}
                </p>
                <p className="text-gray-600">
                  {product.stylist.location?.state || "State not specified"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Verification Status</h4>
                <div className="flex items-center gap-2">
                  {product.stylist.isCompanyVerified ? (
                    <>
                      <FiShield className="text-green-500" />
                      <span className="text-green-600 font-medium">Verified Stylist</span>
                    </>
                  ) : (
                    <span className="text-gray-600">Not verified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Shipping Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">
                  {product.deliveryInfo || "Ready to ship in 3-5 business days."}
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <FiTruck className="text-amber-500" />
                    Free shipping on orders over ₦50,000
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500">•</span>
                    Express delivery available
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500">•</span>
                    Nationwide delivery
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Return Policy</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">
                  We want you to love your purchase. If you're not completely satisfied, we're here
                  to help.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Returns accepted within 7 days of delivery</li>
                  <li>• Items must be unworn, unwashed, and in original condition</li>
                  <li>• All tags must be attached</li>
                  <li>• Custom or personalized items cannot be returned</li>
                  <li>• Refunds processed within 5-10 business days</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "qa" && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h4>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h5 className="font-medium text-gray-900 mb-2">
                  Can I get this in a different color?
                </h5>
                <p className="text-gray-600">
                  Yes! Contact the stylist directly to discuss custom color options. You can message
                  them through their profile.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h5 className="font-medium text-gray-900 mb-2">
                  How long does custom tailoring take?
                </h5>
                <p className="text-gray-600">
                  Custom tailoring typically takes 7-14 business days, depending on the complexity
                  of the design and current order volume.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h5 className="font-medium text-gray-900 mb-2">Do you offer plus sizes?</h5>
                <p className="text-gray-600">
                  Most stylists offer extended sizing. Check the available sizes or contact the
                  stylist for custom sizing options.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Can I visit the stylist's workshop?
                </h5>
                <p className="text-gray-600">
                  Many stylists welcome appointments. Contact the stylist directly through their
                  profile to schedule a visit.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
