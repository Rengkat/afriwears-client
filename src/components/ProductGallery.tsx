"use client";

import Image from "next/image";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiZoomIn } from "react-icons/fi";

interface ProductGalleryProps {
  images: string[];
  selectedImage: number;
  onSelectImage: (index: number) => void;
  productName: string;
}

const ProductGallery = ({
  images,
  selectedImage,
  onSelectImage,
  productName,
}: ProductGalleryProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const nextImage = () => {
    onSelectImage((selectedImage + 1) % images.length);
  };

  const prevImage = () => {
    onSelectImage((selectedImage - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative bg-white rounded-xl overflow-hidden border border-gray-200 aspect-square cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}>
        <Image
          src={images[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Zoom Overlay */}
        {isZoomed && (
          <div
            className="absolute inset-0 bg-[length:200%] bg-no-repeat"
            style={{
              backgroundImage: `url(${images[selectedImage]})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />
        )}

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full">
          <FiZoomIn size={20} />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              title="prev image"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all">
              <FiChevronLeft size={24} />
            </button>
            <button
              title="next image"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all">
              <FiChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              title="on select image"
              key={index}
              onClick={() => onSelectImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-amber-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}>
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="text-sm text-gray-500">
        Image {selectedImage + 1} of {images.length}
      </div>
    </div>
  );
};

export default ProductGallery;
