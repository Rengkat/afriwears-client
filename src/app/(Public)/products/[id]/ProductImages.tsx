"use client";
import Image from "next/image";
import React, { useState } from "react";
import { BsZoomIn } from "react-icons/bs";

interface ProductImagesProps {
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  product: any;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  images,
  selectedImage,
  setSelectedImage,
  product,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full lg:w-1/2 p-4 md:p-8">
        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-8">
      {/* Main Image */}
      <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-4 group cursor-zoom-in">
        <Image
          src={images[selectedImage]}
          alt={`${product.name} - Image ${selectedImage + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          priority
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNewProduct && (
            <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              NEW
            </span>
          )}
          {product.featured && (
            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              FEATURED
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              BEST SELLER
            </span>
          )}
          {product.stock <= 0 && (
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <BsZoomIn className="w-5 h-5 text-gray-700" />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative h-20 md:h-24 rounded-md overflow-hidden border-2 transition-all duration-200 ${
              selectedImage === index
                ? "border-amber-500 ring-2 ring-amber-200"
                : "border-transparent hover:border-gray-300"
            }`}>
            <Image
              src={img}
              alt={`${product.name} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12vw, 12vw"
            />
            {/* Selected indicator */}
            {selectedImage === index && <div className="absolute inset-0 bg-amber-500/20"></div>}
          </button>
        ))}
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="mt-3 text-center text-sm text-gray-500">
          Image {selectedImage + 1} of {images.length}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
