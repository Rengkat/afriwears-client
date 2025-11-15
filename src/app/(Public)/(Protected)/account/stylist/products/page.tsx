"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiClock, FiBox } from "react-icons/fi";
import { stylistmockProducts } from "@/mockData";

const StylistProductsPage = () => {
  const [products, setProducts] = useState(stylistmockProducts);
  const [filter, setFilter] = useState("all");

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((product) =>
          filter === "approved" ? product.status === "approved" : product.status === "pending"
        );

  const handleDelete = (id: string) => {
    // In a real app, you would call an API to delete the product
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            My Products
          </h1>
          <p className="text-gray-600 mt-1">
            {products.length} {products.length === 1 ? "product" : "products"} in your collection
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select
              title="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
              <option value="all">All Products</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <Link
            href="/account/stylist/products/add-product"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
            <FiPlus className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
            <FiBox className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === "approved"
              ? "You don't have any approved products yet"
              : "You don't have any products pending approval"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {filter === "approved"
              ? "Add new products or wait for admin approval on your pending products."
              : "All your products have been approved!"}
          </p>
          <Link
            href="/stylist/products/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
            <FiPlus className="mr-2" />
            Add New Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                    Performance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            className="h-10 w-10 rounded-md object-cover"
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₦{product.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          product.stock === 0 ? "text-red-600" : "text-gray-900"
                        }`}>
                        {product.stock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                        {product.status === "approved" ? (
                          "Approved"
                        ) : (
                          <span className="flex items-center">
                            <FiClock className="mr-1" /> Pending
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Views: {product.views}</div>
                        <div>Orders: {product.orders}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="View">
                          <FiEye size={16} />
                        </Link>
                        <Link
                          href={`/stylist/products/edit/${product.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit">
                          <FiEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StylistProductsPage;
