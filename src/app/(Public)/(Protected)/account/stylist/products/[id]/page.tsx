"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiStar,
  FiShare2,
  FiHeart,
  FiTruck,
  FiShield,
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useGetProductDetailQuery, useDeleteProductMutation } from "@/redux/services/ProductApi";
import ProductInfo from "@/components/ProductInfo";
// import StylistCard from "@/components/StylistCard";
// import ProductTabs from "@/components/ProductTabs";
import ProductGallery from "@/components/ProductGallery";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import ProductTabs from "./ProductTabs";
import { RootState } from "@/redux/Store";

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { user: localUser } = useSelector((store: RootState) => store.authSlice);

  const {
    data: productData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductDetailQuery(productId);

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const product = productData?.product;

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/account/stylist/products"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors">
            Back to My Products
          </Link>
        </div>
      </div>
    );
  }

  // Check if current user owns this product
  const isOwner = localUser?.company?.id === product.stylist?.toString();
  console.log(localUser?.company?.id, product.stylist?.toString());
  const handleEdit = () => {
    router.push(`/account/stylist/products/edit/${productId}`);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully");
      router.push("/account/stylist/products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  const images = [product.mainImage, ...(product.subImages || [])].filter(Boolean);
  const isOutOfStock = product.stock === 0;

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "published":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/account/stylist" className="hover:text-amber-600 transition-colors">
                Dashboard
              </Link>
              <span className="mx-2">/</span>
              <Link
                href="/account/stylist/products"
                className="hover:text-amber-600 transition-colors">
                My Products
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
            </div>

            {/* Action Buttons */}
            {isOwner && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors text-sm">
                  <FiEdit size={16} />
                  Edit Product
                </button>

                {product.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiTrash2 size={16} />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiAlertCircle className="text-red-500 text-2xl" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<span className="font-medium">{product.name}</span>"?
              This action cannot be undone and all associated images will be permanently removed.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                {isDeleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <div className={`mb-6 p-4 rounded-lg ${getStatusColor(product.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {product.status === "approved" || product.status === "published" ? (
                <FiCheckCircle className="text-green-600" size={20} />
              ) : product.status === "rejected" ? (
                <FiXCircle className="text-red-600" size={20} />
              ) : (
                <FiAlertCircle className="text-amber-600" size={20} />
              )}
              <div>
                <h3 className="font-semibold">
                  Product Status: <span className="capitalize">{product.status}</span>
                </h3>
                {product.status === "rejected" && product.rejectionReason && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Reason:</span> {product.rejectionReason}
                  </p>
                )}
                {product.status === "approved" && product.approvedBy && (
                  <p className="text-sm mt-1">
                    Approved on {formatDate(product.updatedAt || product.createdAt)}
                  </p>
                )}
              </div>
            </div>

            {product.status === "pending" && (
              <div className="text-sm">
                <span className="font-medium">Submitted:</span> {formatDate(product.createdAt)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Product Images */}
          <div className="lg:w-1/2">
            <ProductGallery
              images={images}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
              productName={product.name}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:w-1/2">
            {/* Product Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-2">
                  {/* Product Flags */}
                  <div className="flex gap-2">
                    {product.featured && (
                      <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                        Featured
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Best Seller
                      </span>
                    )}
                    {product.isNewProduct && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-500">SKU:</span>
                  <span className="ml-2 font-medium">{product.sku}</span>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 font-medium capitalize">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2 font-medium capitalize">{product.type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <span className="ml-2 font-medium">{product.stock} units</span>
                </div>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(product.rating || 0)
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {product.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount || product.reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₦{product.price?.toLocaleString()}
                  </span>
                  {product.minPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ₦{product.maxPrice?.toLocaleString()}
                    </span>
                  )}
                  {product.maxPrice && product.maxPrice > product.price && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                      Save ₦{(product.maxPrice - product.price).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>
            </div>

            {/* Variants */}
            <ProductInfo
              product={product}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              quantity={quantity}
              setQuantity={setQuantity}
            />

            {/* Stock Status */}
            <div className="mb-6">
              {isOutOfStock ? (
                <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg">
                  <span className="font-medium">Out of Stock</span>
                </div>
              ) : (
                <div className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-lg">
                  <span className="font-medium"> {product.stock} units in stock</span>
                </div>
              )}
            </div>

            {/* Management Notes for Stylist */}
            {isOwner && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Management Notes</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {product.status === "pending" && (
                    <li>• Your product is awaiting admin approval</li>
                  )}
                  {product.status === "rejected" && (
                    <li>• Update your product based on the rejection reason above</li>
                  )}
                  {product.status === "approved" && (
                    <li>• Your product is live and visible to customers</li>
                  )}
                  {product.stock < 10 && <li>• Low stock alert: Consider restocking soon</li>}
                  {isOutOfStock && (
                    <li>• Product is out of stock - update inventory to resume sales</li>
                  )}
                </ul>
              </div>
            )}

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{product.reviewCount || 0}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{product.stock}</div>
                <div className="text-sm text-gray-600">Available Stock</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs - Enhanced for Stylist View */}
        <div className="mt-12">
          <ProductTabs product={product} isOwner={true} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
