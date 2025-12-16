"use client";

import Link from "next/link";
import { FiMinus, FiPlus } from "react-icons/fi";

interface ProductInfoProps {
  product: any;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const ProductInfo = ({
  product,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
}: ProductInfoProps) => {
  // Extract variants from new attributes structure
  const sizes = product.attributes?.sizes || [];
  const colors = product.attributes?.colors || [];
  const material = product.attributes?.material || product.materials || "";

  return (
    <div className="space-y-6 mb-8">
      {/* Size Selector */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="font-medium text-gray-900">Size</label>
            {/* <button className="text-sm text-amber-600 hover:text-amber-700">Size Guide</button> */}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedSize === size
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}>
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div>
          <label className="font-medium text-gray-900 mb-3 block">Color</label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color: any) => {
              const colorName = color.name || color;
              const colorHex = color.hexCode || color;
              const isSelected = selectedColor === colorName;

              return (
                <button
                  key={colorName}
                  onClick={() => setSelectedColor(colorName === selectedColor ? null : colorName)}
                  className={`relative p-1 rounded-full border-2 transition-all ${
                    isSelected ? "border-amber-500" : "border-gray-200 hover:border-gray-300"
                  }`}
                  title={colorName}>
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{
                      backgroundColor: colorHex,
                      border:
                        colorHex === "#FFFFFF" || colorHex === "#fff" || colorHex === "white"
                          ? "1px solid #e5e7eb"
                          : "none",
                    }}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Material */}
      {material && (
        <div>
          <label className="font-medium text-gray-900 mb-2 block">Material</label>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {material}
            </span>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {/* <div>
        <label className="font-medium text-gray-900 mb-3 block">Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              title="quantity"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
              <FiMinus size={18} />
            </button>
            <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
            <button
              title="quanity"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
              className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
              <FiPlus size={18} />
            </button>
          </div>
          <span className="text-sm text-gray-500">Max: {product.stock} units</span>
        </div>
      </div> */}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div>
          <label className="font-medium text-gray-900 mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/products?tag=${tag}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-sm transition-colors">
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
