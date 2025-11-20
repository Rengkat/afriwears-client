"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiPackage,
  FiUser,
  FiDollarSign,
  FiTag,
  FiShoppingBag,
  FiAlertCircle,
} from "react-icons/fi";
import RejectionModel from "./RejectionModel";
import ProductDetailModel from "./ProductDetailModel";
import {
  formatCurrency,
  formatDate,
  getCategoryColor,
  getStatusColor,
  getStatusIcon,
} from "@/Utils/utils";
import Pagination from "./Pagination";
import ProductList from "./ProductList";
import FilterAndSearch from "./FilterAndSearch";
import { mockProducts } from "@/Utils/mockData";
import StatCard from "./StatCard";

const ProductApprovalPage = () => {
  const { user } = useSelector((store: RootState) => store.authSlice);
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
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

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.stylist.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesType = typeFilter === "all" || product.type === typeFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesType;
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle product actions
  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleApproveProduct = (productId: string) => {
    setProducts(
      products.map((p) =>
        p._id === productId
          ? {
              ...p,
              status: "approved",
              isAdminApproved: true,
              rejectionReason: "",
            }
          : p
      )
    );
  };

  const handleRejectProduct = (product: any) => {
    setSelectedProduct(product);
    setShowRejectionModal(true);
  };

  const handleConfirmRejection = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setProducts(
      products.map((p) =>
        p._id === selectedProduct._id
          ? {
              ...p,
              status: "rejected",
              isAdminApproved: false,
              rejectionReason: rejectionReason,
            }
          : p
      )
    );

    setShowRejectionModal(false);
    setRejectionReason("");
    setSelectedProduct(null);
  };

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) return;

    switch (action) {
      case "approve":
        setProducts(
          products.map((p) =>
            selectedProducts.includes(p._id)
              ? {
                  ...p,
                  status: "approved",
                  isAdminApproved: true,
                  rejectionReason: "",
                }
              : p
          )
        );
        setSelectedProducts([]);
        break;
      case "reject":
        // For bulk rejection, we'd typically show a modal for reason
        // For now, using a generic reason
        setProducts(
          products.map((p) =>
            selectedProducts.includes(p._id)
              ? {
                  ...p,
                  status: "rejected",
                  isAdminApproved: false,
                  rejectionReason: "Bulk rejection - does not meet platform standards",
                }
              : p
          )
        );
        setSelectedProducts([]);
        break;
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(currentProducts.map((product) => product._id));
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

  // Stats calculations
  const pendingCount = products.filter((p) => p.status === "pending").length;
  const approvedCount = products.filter((p) => p.status === "approved").length;
  const rejectedCount = products.filter((p) => p.status === "rejected").length;
  const totalProductsCount = products.length;

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
                    checked={
                      selectedProducts.length === currentProducts.length &&
                      currentProducts.length > 0
                    }
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
              {currentProducts.map((product) => {
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
        {currentProducts.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length === 0
                ? "No products match your current filters."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            indexOfFirstProduct={indexOfFirstProduct}
            filteredProducts={filteredProducts}
            indexOfLastProduct={indexOfLastProduct}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <ProductDetailModel
          setShowProductModal={setShowProductModal}
          selectedProduct={selectedProduct}
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
