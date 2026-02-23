"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { FiPackage } from "react-icons/fi";
import RejectionModel from "./RejectionModel";
import ProductDetailModel from "./ProductDetailModel";
import Pagination from "./Pagination";
import ProductList from "./ProductList";
import FilterAndSearch from "./FilterAndSearch";
import { mockProducts } from "@/Utils/mockData";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import StatCard from "./StatCard";
import {
  useVerifyProductMutation,
  useUpdateProductMutation,
  useGetAllProductsAdminQuery,
} from "@/redux/services/ProductApi";
import toast from "react-hot-toast";

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === "object" && error !== null && "status" in error;
};

const ProductApprovalPage = () => {
  const { user } = useSelector((store: RootState) => store.authSlice);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Prepare query parameters for API
  const queryParams: any = {
    page: currentPage,
    limit: productsPerPage,
  };

  // Add filters to query params if not "all"
  if (statusFilter !== "all") queryParams.status = statusFilter;
  if (categoryFilter !== "all") queryParams.category = categoryFilter;
  if (typeFilter !== "all") queryParams.type = typeFilter;
  if (searchTerm) queryParams.name = searchTerm;

  // Fetch products from API
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useGetAllProductsAdminQuery(queryParams);
  // console.log(productsData);
  // Mutation hooks for product actions
  const [verifyProduct] = useVerifyProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;
  const totalPages = productsData?.pages || 1;

  // Handle product approval
  const handleApproveProduct = async (productId: string) => {
    try {
      await verifyProduct({
        productId,
        action: "approve",
      }).unwrap();

      toast.success("Product approved successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve product");
    }
  };

  // Handle product rejection
  const handleRejectProduct = async (product: any) => {
    setSelectedProduct(product);
    setShowRejectionModal(true);
  };

  const handleConfirmRejection = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    if (!selectedProduct?._id) return;

    try {
      await verifyProduct({
        productId: selectedProduct._id,
        action: "reject",
        reason: rejectionReason,
      }).unwrap();

      toast.success("Product rejected successfully!");
      setShowRejectionModal(false);
      setRejectionReason("");
      setSelectedProduct(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject product");
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) return;

    try {
      if (action === "approve") {
        // Approve all selected products
        await Promise.all(
          selectedProducts.map((productId) =>
            verifyProduct({
              productId,
              action: "approve",
            }).unwrap(),
          ),
        );
        toast.success(`${selectedProducts.length} product(s) approved successfully!`);
      } else if (action === "reject") {
        // For bulk rejection, we'd need a way to get rejection reason for each
        // For now, using a generic reason
        await Promise.all(
          selectedProducts.map((productId) =>
            verifyProduct({
              productId,
              action: "reject",
              reason: "Bulk rejection - does not meet platform standards",
            }).unwrap(),
          ),
        );
        toast.success(`${selectedProducts.length} product(s) rejected successfully!`);
      }

      setSelectedProducts([]);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${action} products`);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((product: any) => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Stats calculations from real data
  const pendingCount = products.filter((p: any) => p.status === "pending").length;
  const approvedCount = products.filter((p: any) => p.status === "approved").length;
  const rejectedCount = products.filter((p: any) => p.status === "rejected").length;
  const totalProductsCount = totalProducts;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-medium text-red-800">Error loading products</h3>
          <p className="text-red-700 mt-2">
            {isFetchBaseQueryError(error)
              ? (error.data as any)?.message
              : "Failed to fetch products. Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Product Approval</h1>
            <p className="text-gray-600 mt-1">Review and approve products submitted by stylists</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transition-colors mr-2">
              Refresh
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
              Export Products
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatCard
        totalProductsCount={totalProductsCount}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
      />

      {/* Filters and Search */}
      <FilterAndSearch
        handleBulkAction={handleBulkAction}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        selectedProducts={selectedProducts}
      />

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    title="selectAllProducts"
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedProducts.length === products.length && products.length > 0}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stylist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product: any) => {
                // console.log(product);
                return (
                  <ProductList
                    key={product._id}
                    product={product}
                    selectedProducts={selectedProducts}
                    handleSelectProduct={handleSelectProduct}
                    handleViewProduct={handleViewProduct}
                    handleApproveProduct={handleApproveProduct}
                    handleRejectProduct={handleRejectProduct}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ||
              statusFilter !== "all" ||
              categoryFilter !== "all" ||
              typeFilter !== "all"
                ? "No products match your current filters."
                : "No products available for approval."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            indexOfFirstProduct={(currentPage - 1) * productsPerPage}
            filteredProducts={products}
            indexOfLastProduct={Math.min(currentPage * productsPerPage, totalProducts)}
            setCurrentPage={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <ProductDetailModel
          setShowProductModal={setShowProductModal}
          productId={selectedProduct}
          handleApproveProduct={handleApproveProduct}
          handleRejectProduct={handleRejectProduct}
        />
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedProduct && (
        <RejectionModel
          selectedProduct={selectedProduct}
          setRejectionReason={setRejectionReason}
          rejectionReason={rejectionReason}
          setShowRejectionModal={setShowRejectionModal}
          handleConfirmRejection={handleConfirmRejection}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </div>
  );
};

export default ProductApprovalPage;
