"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiTruck, FiCheckCircle, FiClock, FiPrinter } from "react-icons/fi";
import Image from "next/image";
import OrderSummary from "./OrderSummary";
import OrderAction from "./OrderAction";

// Mock order data
const mockOrder = {
  id: "ORD-7892",
  customer: {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+234 801 234 5678",
    address: "25 Fashion Avenue, Victoria Island, Lagos, Nigeria",
  },
  date: "May 15, 2023",
  status: "processing",
  items: [
    {
      id: "prod-7892",
      name: "Premium Ankara Jumpsuit",
      image: "/product-1.jpg",
      price: 25000,
      quantity: 1,
      subtotal: 25000,
    },
    {
      id: "prod-1234",
      name: "Matching Headwrap",
      image: "/product-4.jpg",
      price: 10000,
      quantity: 1,
      subtotal: 10000,
    },
  ],
  shipping: 2000,
  total: 37000,
  paymentMethod: "Pay on Delivery",
  trackingNumber: "TRK-789456123",
  notes: "Please package carefully as this is a gift",
};

const OrderDetailPage = ({ params }) => {
  const router = useRouter();
  const [order, setOrder] = useState(mockOrder);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateOrderStatus = async (newStatus) => {
    setIsUpdating(true);
    // In a real app, you would call an API to update the order status
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOrder((prev) => ({ ...prev, status: newStatus }));
    setIsUpdating(false);
  };

  const getStatusBadge = () => {
    const baseClasses = "px-3 py-1 inline-flex items-center text-sm font-medium rounded-full";

    switch (order.status) {
      case "processing":
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case "shipped":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "delivered":
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = () => {
    switch (order.status) {
      case "processing":
        return <FiClock className="mr-1" />;
      case "shipped":
        return <FiTruck className="mr-1" />;
      case "delivered":
        return <FiCheckCircle className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-amber-600 hover:text-amber-700">
          <FiArrowLeft className="mr-2" />
          Back to Orders
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order #{order.id}</h1>
          <p className="text-gray-600 mt-1">Placed on {order.date}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={getStatusBadge()}>
            {getStatusIcon()}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>

          <button
            title="print"
            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            <FiPrinter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <OrderSummary order={order} />
        {/* Order Actions */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-800">Shipping Information</h2>
            </div>

            <div className="p-6">
              {order.status === "shipped" || order.status === "delivered" ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Tracking Number</h3>
                    <p className="text-gray-900">{order.trackingNumber}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Courier</h3>
                    <p className="text-gray-900">DHL Express</p>
                  </div>

                  <a
                    href="#"
                    className="inline-block mt-2 text-sm font-medium text-amber-600 hover:text-amber-700">
                    Track Package
                  </a>
                </div>
              ) : (
                <p className="text-gray-600">This order has not been shipped yet.</p>
              )}
            </div>
          </div>

          {/* Order Actions */}
          <OrderAction
            order={order}
            updateOrderStatus={updateOrderStatus}
            isUpdating={isUpdating}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
