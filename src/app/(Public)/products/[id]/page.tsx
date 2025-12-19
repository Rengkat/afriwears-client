"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShare2, FiHeart, FiChevronLeft } from "react-icons/fi";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import MeasurementsForm from "./MeasurementForm";
import ProductImages from "./ProductImages";
import ProductInfor from "./ProductInfor";
// import AddCartButton from "../addCartButton";
// import WishlistBtn from "@/components/WishlistBtn";
// import BuyButton from "@/components/BuyButton";
// import MeasurementsForm from "./MeasurementsForm";

// Mock data for product images
const productImages = ["/product-1.jpg", "/product-2.jpg", "/product-3.jpg", "/product-4.jpg"];

const mockProduct = {
  _id: "prod123",
  name: "Premium Ankara Jumpsuit",
  minPrice: 25000,
  maxPrice: 32000,
  stylist: "Amina Couture",
  slug: { current: "premium-ankara-jumpsuit" },
  productDetails:
    "Handcrafted Ankara jumpsuit with intricate embroidery details. Made from 100% African wax print fabric with comfortable stretch for all-day wear. Features a flattering V-neckline, adjustable waist tie, and wide-leg silhouette perfect for any occasion.",
  rating: 4.7,
  reviews: 128,
  materials: "100% African Wax Cotton",
  careInstructions: "Hand wash cold, line dry, iron on low heat",
  deliveryInfo: "Ready to ship in 3-5 business days. Free shipping on orders over ₦50,000",
  sizes: ["S", "M", "L", "XL"],
  colors: ["#B83227", "#2C3E50", "#F39C12", "#1E8449"],
};

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/products" className="flex items-center text-gray-600 hover:text-gray-900">
          <FiChevronLeft className="mr-1" /> Back to Products
        </Link>
      </div>

      {/* Product Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Product Images */}
            <ProductImages
              selectedImage={selectedImage}
              productImages={productImages}
              mockProduct={mockProduct}
              setSelectedImage={setSelectedImage}
            />
            {/* Product Info */}
            <ProductInfor
              showMeasurements={showMeasurements}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              mockProduct={mockProduct}
              setShowMeasurements={setShowMeasurements}
            />
          </div>
        </div>

        {/* Related Products & Reviews Section */}
        <div className="mt-16">
          {/* You would add related products and reviews components here */}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
