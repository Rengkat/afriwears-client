"use client";
import Link from "next/link";
import React from "react";
import { FiBox, FiPlus } from "react-icons/fi";

const EmptyProducts = ({ status }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
        <FiBox className="w-full h-full" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {status === "approved"
          ? "You don't have any approved products yet"
          : status === "pending"
          ? "No pending products found"
          : "You haven't added any products yet"}
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        {status === "approved"
          ? "Add new products or wait for admin approval on your pending products."
          : status === "pending"
          ? "All your products have been approved!"
          : "Start by adding your first product to showcase your work."}
      </p>
      <Link
        href="/account/stylist/products/add-product"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
        <FiPlus className="mr-2" />
        Add Your First Product
      </Link>
    </div>
  );
};

export default EmptyProducts;
