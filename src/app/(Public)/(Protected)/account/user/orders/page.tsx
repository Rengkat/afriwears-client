"use client";
import { useGetMyOrdersQuery } from "@/redux/services/OrderApiSlice";
import Link from "next/link";
import { useState } from "react";
import {
  FiPackage,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    mainImage: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  status: "delivered" | "shipped" | "processing";
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const statusStyles = {
  delivered: {
    bg: "bg-green-50",
    text: "text-green-800",
    icon: FiCheckCircle,
    label: "Delivered",
  },
  shipped: {
    bg: "bg-blue-50",
    text: "text-blue-800",
    icon: FiTruck,
    label: "Shipped",
  },
  processing: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    icon: FiClock,
    label: "Processing",
  },
};

const OrdersPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: ordersData, isLoading, isError } = useGetMyOrdersQuery({ page, limit });

  const orders = ordersData?.orders || [];
  const totalOrders = ordersData?.count || 0;
  const totalPages = Math.ceil(totalOrders / limit);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">View your order history and track recent purchases</p>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-20 w-20 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">View your order history and track recent purchases</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <FiPackage className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading orders</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            We couldn't load your orders. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-1">View your order history and track recent purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <FiPackage className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            You haven't placed any orders yet. When you do, they'll appear here.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {orders.map((order: Order) => {
              const StatusIcon = statusStyles[order.status].icon;
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Order Header */}
                  <div className="border-b border-gray-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <h3 className="font-medium text-gray-900">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          statusStyles[order.status].bg
                        } ${statusStyles[order.status].text}`}>
                        <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
                        {statusStyles[order.status].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar className="text-gray-400" />
                      <span>Placed on {formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-gray-100">
                    {order.orderItems.map((item) => (
                      <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                            {item.product.mainImage ? (
                              <img
                                src={item.product.mainImage}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400">
                                <FiPackage className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="font-medium text-gray-900">
                            ₦{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="border-t border-gray-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      {order.status === "shipped" && order.trackingNumber && (
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Tracking #:</span> {order.trackingNumber}
                        </p>
                      )}
                      {order.status === "delivered" && order.deliveredAt ? (
                        <p className="text-sm text-gray-500">
                          Delivered on {formatDate(order.deliveredAt)}
                        </p>
                      ) : order.status === "shipped" && order.estimatedDelivery ? (
                        <p className="text-sm text-gray-500">
                          Estimated delivery: {formatDate(order.estimatedDelivery)}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Last updated: {formatDate(order.updatedAt)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm text-gray-500">Total:</p>
                      <p className="text-lg font-bold text-gray-900">
                        ₦{order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-medium">{Math.min(page * limit, totalOrders)}</span> of{" "}
                <span className="font-medium">{totalOrders}</span> orders
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <FiChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                  <FiChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;
