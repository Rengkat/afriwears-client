"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiClock, FiBox, FiFilter } from "react-icons/fi";
import { useGetMyProductsQuery } from "@/redux/services/ProductApi";
import Loading from "./Loading";
import Error from "./Error";
import EmptyProducts from "./EmptyProducts";
import ProductList from "./ProductList";
import Pagination from "./Pagination";

const StylistProductsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [featured, setFeatured] = useState<boolean | undefined>(undefined);

  const {
    isLoading,
    data: apiData,
    isError,
    error,
    refetch,
  } = useGetMyProductsQuery({
    page: page,
    limit: limit,
    status,
    category,
    type,
    featured: featured?.toString(),
  });

  const products = apiData?.products || [];
  const total = apiData?.total || 0;
  const totalPages = apiData?.pages || 1;
  const count = apiData?.count || 0;

  // Handle filter changes
  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setStatus(undefined);
    } else {
      setStatus(value);
    }
  };

  const handleFeaturedChange = (value: string) => {
    if (value === "all") {
      setFeatured(undefined);
    } else {
      setFeatured(value === "featured");
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleDelete = async (id: string) => {
    // Note: You'll need to implement deleteProduct mutation in your API
    console.log("Delete product:", id);
    // In a real implementation:
    // await deleteProduct(id).unwrap();
    // refetch();
  };

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // Error state
  if (isError) {
    return <Error refetch={refetch} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            My Products
          </h1>
          <p className="text-gray-600 mt-1">
            {total} {total === 1 ? "product" : "products"} in your collection
            {apiData?.fromCache && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
                Cached
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/account/stylist/products/add-product"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
            <FiPlus className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <div className="relative">
            <select
              title="Status filter"
              value={status || "all"}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm">
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="relative">
            <select
              title="Featured filter"
              value={featured === undefined ? "all" : featured ? "featured" : "not-featured"}
              onChange={(e) => handleFeaturedChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm">
              <option value="all">All Products</option>
              <option value="featured">Featured Only</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>

          <button
            onClick={() => {
              setStatus(undefined);
              setCategory(undefined);
              setType(undefined);
              setFeatured(undefined);
              setPage(1);
            }}
            className="text-sm text-amber-600 hover:text-amber-700">
            Clear Filters
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyProducts status={status} />
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products?.map((product) => {
                    return (
                      <ProductList
                        key={product._id}
                        product={product}
                        handleDelete={handleDelete}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              handlePrevPage={handlePrevPage}
              page={page}
              totalPages={totalPages}
              handleNextPage={handleNextPage}
              limit={limit}
              total={total}
            />
          )}
        </>
      )}
    </div>
  );
};

export default StylistProductsPage;
