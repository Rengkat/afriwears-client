import Image from "next/image";
import React from "react";

const ProductImages = ({ selectedImage, productImages, mockProduct, setSelectedImage }: any) => {
  return (
    <div className="w-full lg:w-1/2 p-4 md:p-8">
      <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-4">
        <Image
          src={productImages[selectedImage]}
          alt={mockProduct.name}
          fill
          className="object-cover"
        />
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            NEW
          </span>
          {mockProduct.maxPrice - mockProduct.minPrice > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              SALE
            </span>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {productImages.map((img, index) => (
          <button
            title="thumbnail"
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative h-20 rounded-md overflow-hidden border-2 ${
              selectedImage === index ? "border-amber-500" : "border-transparent"
            }`}>
            <Image
              src={img}
              alt={`${mockProduct.name} thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
