"use client";
import { useDeleteProductMutation } from "@/redux/services/ProductApi";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FiClock, FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmationModel";
import { createPortal } from "react-dom";

const ProductList = ({ product }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deleteMyProduct, { isLoading, isError }] = useDeleteProductMutation();

  // component is mounted before using portal (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Open confirmation modal
  const openDeleteModal = () => {
    if (product?.status !== "pending") {
      return;
    }
    setIsModalOpen(true);
  };

  // Close confirmation modal
  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  // Delete product handler
  const handleDelete = async () => {
    try {
      await deleteMyProduct(product?._id).unwrap();
      toast.success("Product deleted successfully!", {
        position: "top-center",
      });
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product. Please try again.", {
        position: "top-center",
      });
      console.error("Delete product error:", error);
    }
  };

  return (
    <>
      {/* This <tr> stays inside the tbody where it belongs */}
      <tr className="relative">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <Image
                className="h-10 w-10 rounded-md object-cover"
                src={product?.mainImage || "/avatr.png"}
                alt={product?.name}
                width={40}
                height={40}
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{product?.name}</div>
              <div className="text-xs text-gray-500">{product?.category}</div>
              {product?.featured && (
                <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded mt-1 inline-block">
                  Featured
                </span>
              )}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">₦{product?.price?.toLocaleString() || "0"}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className={`text-sm ${product?.stock === 0 ? "text-red-600" : "text-gray-900"}`}>
            {product?.stock || 0}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              product?.status === "approved"
                ? "bg-green-100 text-green-800"
                : product?.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-amber-100 text-amber-800"
            }`}>
            {product?.status === "approved" ? (
              "Approved"
            ) : product?.status === "rejected" ? (
              "Rejected"
            ) : (
              <span className="flex items-center">
                <FiClock className="mr-1" /> Pending
              </span>
            )}
          </span>
          {product?.rejectionReason && (
            <div className="text-xs text-red-600 mt-1 max-w-xs">
              {product?.rejectionReason?.substring(0, 20)}...
            </div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            <div className="flex items-center">
              <span className="text-amber-500">★</span>
              <span className="ml-1">{product?.rating?.toFixed(1) || "0.0"}</span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end gap-2">
            <Link
              href={`/account/stylist/products/${product?._id}`}
              className="text-gray-600 hover:text-gray-900 p-1"
              title="View">
              <FiEye size={16} />
            </Link>
            {product?.status === "pending" && (
              <Link
                href={`/account/stylist/products/edit/${product?._id}`}
                className="text-blue-600 hover:text-blue-900 p-1"
                title="Edit">
                <FiEdit size={16} />
              </Link>
            )}
            <button
              onClick={openDeleteModal}
              className={`p-1 ${
                product?.status === "pending"
                  ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                  : "text-gray-400 cursor-not-allowed"
              } rounded transition-colors`}
              title={
                product?.status === "pending" ? "Delete" : "Only pending products can be deleted"
              }
              disabled={product?.status !== "pending"}>
              <FiTrash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {/* Modal rendered OUTSIDE the table using portal */}
      {mounted &&
        isModalOpen &&
        createPortal(
          <ConfirmModal
            isOpen={isModalOpen}
            onClose={closeDeleteModal}
            onConfirm={handleDelete}
            title="Delete Product"
            message={`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`}
            confirmText="Delete Product"
            cancelText="Cancel"
            isLoading={isLoading}
            isDanger={true}
          />,
          document.getElementById("modal-root")!,
        )}
    </>
  );
};

export default ProductList;
