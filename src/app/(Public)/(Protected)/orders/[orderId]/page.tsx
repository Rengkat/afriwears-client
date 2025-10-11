"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiTruck, FiCheckCircle, FiClock, FiPrinter } from "react-icons/fi";
import Image from "next/image";

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

          <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            <FiPrinter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-800">Order Summary</h2>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0">
                      <div className="h-24 w-24 rounded-md overflow-hidden relative">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">₦{item.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">
                        Subtotal: ₦{item.subtotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₦{(order.total - order.shipping).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₦{order.shipping.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Total</span>
                  <span>₦{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-800">Customer Information</h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Customer Name</h3>
                  <p className="text-gray-900">{order.customer.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                  <p className="text-gray-900">{order.customer.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                  <p className="text-gray-900">{order.customer.phone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h3>
                  <p className="text-gray-900">{order.customer.address}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                  <p className="text-gray-900">{order.paymentMethod}</p>
                </div>

                {order.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Order Notes</h3>
                    <p className="text-gray-900 italic">"{order.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-800">Order Actions</h2>
            </div>

            <div className="p-6">
              {order.status === "processing" && (
                <button
                  onClick={() => updateOrderStatus("shipped")}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                  {isUpdating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiTruck size={16} />
                      Mark as Shipped
                    </>
                  )}
                </button>
              )}

              {order.status === "shipped" && (
                <button
                  onClick={() => updateOrderStatus("delivered")}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed">
                  {isUpdating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={16} />
                      Mark as Delivered
                    </>
                  )}
                </button>
              )}

              {order.status === "delivered" && (
                <div className="text-center py-2">
                  <p className="text-green-600 font-medium">This order has been delivered</p>
                  <p className="text-sm text-gray-500 mt-1">Delivered on May 18, 2023</p>
                </div>
              )}

              <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                Contact Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
