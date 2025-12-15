"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiStar, FiShare2, FiHeart, FiTruck, FiShield, FiArrowLeft } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useGetProductDetailQuery } from "@/redux/services/ProductApi";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductActions from "@/components/products/ProductActions";
import ProductTabs from "@/components/products/ProductTabs";
import RelatedProducts from "@/components/products/RelatedProducts";
import StylistCard from "@/components/products/StylistCard";

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.id as string;

  const {
    data: productData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductDetailQuery(productId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const product = productData?.product;

  // Handle loading and error states
  if (isLoading) {
    return <Loading />;
  }

  if (isError || !product) {
    return <Error refetch={refetch} />;
  }

  const images = [product.mainImage, ...(product.subImages || [])];
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-amber-600 transition-colors">
              Products
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-amber-600 transition-colors capitalize">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {/* Back Button for Mobile */}
            <div className="lg:hidden mb-4">
              <Link
                href="/products"
                className="inline-flex items-center text-gray-600 hover:text-gray-900">
                <FiArrowLeft className="mr-2" />
                Back to Products
              </Link>
            </div>

            {/* Product Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <FiShare2 size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500">
                    <FiHeart size={20} />
                  </button>
                </div>
              </div>

              {/* Stylist Info */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">By</span>
                <Link
                  href={`/stylists/${product.stylist?._id}`}
                  className="text-sm font-medium text-amber-600 hover:text-amber-700">
                  {product.stylistName || product.stylist?.name || "Unknown Stylist"}
                </Link>
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
                <Link href="#reviews" className="text-sm text-gray-500 hover:text-amber-600">
                  ({product.reviewCount || product.reviews?.length || 0} reviews)
                </Link>
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
              ) : product.stock < 10 ? (
                <div className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-lg">
                  <span className="font-medium">Only {product.stock} left in stock</span>
                </div>
              ) : (
                <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                  <span className="font-medium">In Stock</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <ProductActions
              product={product}
              quantity={quantity}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              isOutOfStock={isOutOfStock}
            />

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <FiTruck className="text-gray-400" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield className="text-gray-400" />
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">Returns Accepted</span>
                </div>
              </div>
            </div>

            {/* Stylist Card */}
            <StylistCard stylist={product.stylist} />
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <ProductTabs product={product} />
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <RelatedProducts
            category={product.category}
            currentProductId={product._id}
            stylistId={product.stylist?._id}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
