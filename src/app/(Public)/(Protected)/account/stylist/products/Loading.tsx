"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiPlus } from "react-icons/fi";

const Loading = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-1">Loading your products...</p>
        </div>
        <Link
          href="/account/stylist/products/add-product"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
          <FiPlus className="mr-2" />
          Add Product
        </Link>
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 h-12 w-12 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
