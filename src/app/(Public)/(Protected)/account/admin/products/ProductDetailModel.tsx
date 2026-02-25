import { useGetProductDetailQuery } from "@/redux/services/ProductApi";
import { formatCurrency, getCategoryColor, getStatusColor } from "@/Utils/utils";
import {
  FiX,
  FiPackage,
  FiUser,
  FiAlertCircle,
  FiStar,
  FiMapPin,
  FiMail,
  FiPhone,
  FiGlobe,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiTag,
  FiDroplet,
  FiScissors,
  FiTruck,
  FiCalendar,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { BsInstagram, BsFacebook, BsTwitter, BsPinterest } from "react-icons/bs";

interface Stylist {
  _id: string;
  companyName: string;
  description: string;
  rating: number;
  avatar: string;
  specialty: string[];
  location: {
    state: string;
    lga: string;
    address: string;
    branches: number;
  };
  socialMedia: {
    twitter: string;
    facebook: string;
    instagram: string;
    pinterest: string;
  };
  isCompanyVerified: boolean;
  portfolio: Array<{ image: string; category: string }>;
  phone?: string;
  email?: string;
  website?: string;
}

interface ColorAttribute {
  name: string;
  hexCode: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  productDetails?: string;
  materials?: string;
  careInstructions?: string;
  deliveryInfo?: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  mainImage: string;
  subImages: string[];
  attributes: {
    colors: ColorAttribute[];
    sizes: (string | null)[];
    material: string;
  };
  stylist: Stylist;
  rating: number;
  reviews: any[];
  reviewCount: number;
  isBestSeller?: boolean;
  isNewProduct?: boolean;
  featured: boolean;
  isAdminApproved: boolean;
  createdBy: string;
  stock: number;
  category: string;
  type: string;
  tags: string[];
  status: string;
  rejectionReason?: string;
  approvedBy?: any;
  createdAt: string;
  updatedAt: string;
  slug: string;
  [key: string]: any;
}

interface ProductDetailModelProps {
  setShowProductModal: (show: boolean) => void;
  productId: string;
  handleRejectProduct?: (product: Product) => void;
  handleApproveProduct?: (productId: string) => void;
}

const ProductDetailModel = ({
  setShowProductModal,
  productId,
  handleRejectProduct,
  handleApproveProduct,
}: ProductDetailModelProps) => {
  const { data, isLoading, error } = useGetProductDetailQuery(productId);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (data?.product) {
      setProduct(data.product);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="h-80 bg-gray-200 animate-pulse rounded-xl"></div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Product</h3>
            <p className="text-gray-600 mb-8">Failed to load product details. Please try again.</p>
            <button
              onClick={() => setShowProductModal(false)}
              className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition-all duration-200">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stylist = product.stylist;
  const attributes = product.attributes || { colors: [], sizes: [], material: "" };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <FiPackage className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                <p className="text-sm text-gray-500 mt-1">{product.sku}</p>
              </div>
            </div>
            <button
              onClick={() => setShowProductModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
              title="Close">
              <FiX className="h-6 w-6 text-gray-400 group-hover:text-gray-700" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="p-8">
            {/* Main Product Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Left Column - Images */}
              <div className="lg:col-span-1 space-y-6">
                {/* Main Image */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="relative h-80 w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-white">
                    <img
                      className="h-full w-full object-contain"
                      src={product.mainImage}
                      alt={product.name}
                    />
                  </div>
                </div>

                {/* Additional Images */}
                {product.subImages && product.subImages.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiEdit2 className="text-blue-500" /> Additional Images
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {product.subImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative h-24 overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-blue-300 transition-all duration-200 cursor-pointer group">
                          <img
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            src={image}
                            alt={`${product.name} - ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiCheckCircle className="text-blue-500" /> Product Stats
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-blue-50">
                      <span className="text-sm text-gray-600">Stock Status</span>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}>
                        {product.stock} units
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-blue-50">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <FiStar className="text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({product.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-blue-50">
                      <span className="text-sm text-gray-600">Status</span>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          product.status,
                        )}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Featured</span>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          product.featured
                            ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        {product.featured ? "Featured" : "Standard"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Product Header */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                      <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                      {/* Tags & Categories */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span
                          className={`px-4 py-2 text-sm font-medium rounded-full ${getCategoryColor(
                            product.category,
                          )} border`}>
                          {product.category.toUpperCase()}
                        </span>
                        <span className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200">
                          {product.type}
                        </span>
                        {product.isBestSeller && (
                          <span className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
                            🔥 Best Seller
                          </span>
                        )}
                        {product.isNewProduct && (
                          <span className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                            🆕 New Arrival
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                        {formatCurrency(product.price)}
                      </div>
                      {product.minPrice && product.maxPrice && (
                        <div className="text-sm text-gray-500">
                          Price Range: {formatCurrency(product.minPrice)} -{" "}
                          {formatCurrency(product.maxPrice)}
                        </div>
                      )}
                      {product.tags && product.tags.length > 0 && (
                        <div className="mt-4">
                          <div className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                            <FiTag className="text-gray-400" /> Tags
                          </div>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {product.tags.slice(0, 5).map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full border border-gray-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stylist Card */}
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl border border-purple-100 p-8 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img
                            className="h-full w-full object-cover"
                            src={stylist.avatar}
                            alt={stylist.companyName}
                          />
                        </div>
                        {stylist.isCompanyVerified && (
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                            <FiCheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{stylist.companyName}</h3>
                        <p className="text-gray-600 text-sm mt-1">{stylist.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1">
                            <FiStar className="text-yellow-400 fill-current" />
                            <span className="font-medium">{stylist.rating}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {stylist.specialty?.slice(0, 2).map((spec, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stylist Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Location */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiMapPin className="text-blue-500" />
                        <span className="font-medium">Location</span>
                      </div>
                      <p className="text-sm text-gray-600 pl-6">
                        {stylist.location.address}
                        <br />
                        {stylist.location.state}
                      </p>
                    </div>

                    {/* Contact */}
                    {(stylist.email || stylist.phone) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiPhone className="text-green-500" />
                          <span className="font-medium">Contact</span>
                        </div>
                        <div className="space-y-1 pl-6">
                          {stylist.email && (
                            <p className="text-sm text-gray-600">{stylist.email}</p>
                          )}
                          {stylist.phone && (
                            <p className="text-sm text-gray-600">{stylist.phone}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Social Media */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiGlobe className="text-purple-500" />
                        <span className="font-medium">Social Media</span>
                      </div>
                      <div className="flex gap-3 pl-6">
                        {stylist.socialMedia.instagram && (
                          <a
                            href={stylist.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer">
                            <BsInstagram className="h-5 w-5 text-pink-600 hover:text-pink-700" />
                          </a>
                        )}
                        {stylist.socialMedia.facebook && (
                          <a
                            href={stylist.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer">
                            <BsFacebook className="h-5 w-5 text-blue-600 hover:text-blue-700" />
                          </a>
                        )}
                        {stylist.socialMedia.twitter && (
                          <a
                            href={stylist.socialMedia.twitter}
                            target="_blank"
                            rel="noopener noreferrer">
                            <BsTwitter className="h-5 w-5 text-blue-400 hover:text-blue-500" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Attributes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Colors Section */}
                  <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl border border-pink-100 p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiDroplet className="text-pink-500" /> Available Colors
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {attributes.colors?.map((color: ColorAttribute) => (
                        <div
                          key={color._id}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-50 hover:border-pink-200 transition-all duration-200">
                          <div
                            className="h-10 w-10 rounded-lg shadow-sm border border-gray-200"
                            style={{ backgroundColor: color.hexCode }}
                            title={color.name}
                          />
                          <div>
                            <div className="font-medium text-gray-900">{color.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{color.hexCode}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sizes Section */}
                  <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiScissors className="text-blue-500" /> Available Sizes
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {attributes.sizes
                        ?.filter((size): size is string => Boolean(size))
                        .map((size, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 bg-white text-center rounded-xl border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                            <span className="font-medium text-gray-900">{size}</span>
                          </div>
                        ))}
                    </div>
                    {attributes.material && (
                      <div className="mt-6 pt-6 border-t border-blue-100">
                        <div className="text-sm text-gray-600 mb-2">Material</div>
                        <div className="text-lg font-medium text-gray-900">
                          {attributes.material}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Details */}
                  <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl border border-emerald-100 p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiPackage className="text-emerald-500" /> Product Details
                    </h4>
                    <div className="space-y-4">
                      {product.materials && (
                        <div className="pb-3 border-b border-emerald-50">
                          <div className="text-sm font-medium text-gray-600 mb-1">Materials</div>
                          <p className="text-gray-800">{product.materials}</p>
                        </div>
                      )}
                      {product.careInstructions && (
                        <div className="pb-3 border-b border-emerald-50">
                          <div className="text-sm font-medium text-gray-600 mb-1">
                            Care Instructions
                          </div>
                          <p className="text-gray-800 whitespace-pre-line">
                            {product.careInstructions}
                          </p>
                        </div>
                      )}
                      {product.productDetails && (
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-1">
                            Additional Details
                          </div>
                          <p className="text-gray-800">{product.productDetails}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl border border-orange-100 p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiTruck className="text-orange-500" /> Delivery & Timeline
                    </h4>
                    <div className="space-y-4">
                      {product.deliveryInfo && (
                        <div className="pb-3 border-b border-orange-50">
                          <div className="text-sm font-medium text-gray-600 mb-1">
                            Delivery Information
                          </div>
                          <p className="text-gray-800">{product.deliveryInfo}</p>
                        </div>
                      )}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiCalendar className="text-orange-500" />
                            <span className="text-sm">Created</span>
                          </div>
                          <span className="text-sm text-gray-900">
                            {formatDate(product.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiClock className="text-orange-500" />
                            <span className="text-sm">Last Updated</span>
                          </div>
                          <span className="text-sm text-gray-900">
                            {formatDate(product.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason (if rejected) */}
                {product.rejectionReason && (
                  <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-200 p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <FiAlertCircle className="h-8 w-8 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-red-900">Rejection Details</h4>
                        <p className="text-red-700 text-sm mt-1">Product was rejected by admin</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-red-100 p-6">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {product.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Admin Actions (if pending) */}
                {product.status === "pending" && handleApproveProduct && handleRejectProduct && (
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <h4 className="text-xl font-bold text-gray-900 mb-6">Admin Actions Required</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          handleApproveProduct(product._id);
                          setShowProductModal(false);
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                        <FiCheckCircle className="h-6 w-6" />
                        Approve Product
                      </button>
                      <button
                        onClick={() => {
                          setShowProductModal(false);
                          handleRejectProduct(product);
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                        <FiX className="h-6 w-6" />
                        Reject Product
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModel;
