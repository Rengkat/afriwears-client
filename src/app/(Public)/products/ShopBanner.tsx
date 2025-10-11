import Image from "next/image";
import React from "react";

const ShopBanner = () => {
  return (
    <div className="relative bg-gray-900 text-white h-64 md:h-96">
      <Image
        src="/shop-banner.jpg"
        alt="African Fashion Collection"
        fill
        className="object-cover opacity-70"
        priority
      />
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">African Fashion Collection</h1>
        <p className="text-xl md:text-2xl max-w-2xl">
          Discover authentic African designs for every occasion
        </p>
      </div>
    </div>
  );
};

export default ShopBanner;
