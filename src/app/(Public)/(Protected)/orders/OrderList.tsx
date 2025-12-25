import Link from "next/link";
import React from "react";
import {
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiClock,
  FiEye,
  FiTruck,
} from "react-icons/fi";

const OrderList = ({ order, toggleOrderExpand, expandedOrder, updateOrderStatus }: any) => {
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 inline-flex items-center text-sm font-medium rounded-full";

    switch (status) {
      case "pending":
        return `${baseClasses} bg-gray-50 text-gray-800 border border-gray-200`;
      case "processing":
        return `${baseClasses} bg-amber-50 text-amber-800 border border-amber-200`;
      case "shipped":
        return `${baseClasses} bg-blue-50 text-blue-800 border border-blue-200`;
      case "delivered":
        return `${baseClasses} bg-green-50 text-green-800 border border-green-200`;
      case "cancelled":
        return `${baseClasses} bg-red-50 text-red-800 border border-red-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-800 border border-gray-200`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="mr-2" size={14} />;
      case "processing":
        return <FiClock className="mr-2" size={14} />;
      case "shipped":
        return <FiTruck className="mr-2" size={14} />;
      case "delivered":
        return <FiCheckCircle className="mr-2" size={14} />;
      default:
        return null;
    }
  };

  return (
    <>
      <tr
        key={order.id}
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => toggleOrderExpand(order.id)}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <button
              className="mr-2 text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                toggleOrderExpand(order.id);
              }}>
              {expandedOrder === order.id ? (
                <FiChevronDown size={16} />
              ) : (
                <FiChevronRight size={16} />
              )}
            </button>
            <div>
              <div className="text-sm font-medium text-gray-900">
                #{order.orderNumber || order.id}
              </div>
              {order.orderType && (
                <div className="text-xs text-gray-500">
                  {order.orderType === "custom" ? "Custom Order" : "Standard Order"}
                </div>
              )}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{order.customer}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{order.date}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-semibold text-gray-900">
            ₦{order.amount.toLocaleString()}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={getStatusBadge(order.status)}>
            {getStatusIcon(order.status)}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end items-center gap-3">
            <Link
              href={`/stylist/orders/${order.id}`}
              className="text-gray-600 hover:text-gray-900 p-1"
              title="View Details"
              onClick={(e) => e.stopPropagation()}>
              <FiEye size={16} />
            </Link>
          </div>
        </td>
      </tr>
      {expandedOrder === order.id && (
        <tr className="bg-gray-50">
          <td colSpan="6" className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Items Ordered</h4>
                <ul className="space-y-2">
                  {order.items &&
                    order.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity} × {item.name}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </li>
                    ))}
                </ul>
                {order.items?.some((item) => item.measurements) && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Measurements</h5>
                    <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                      Custom measurements provided
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="text-gray-900 font-medium">{order.shipping.address}</span>
                  </div>
                  {order.shipping.courier !== "Not specified" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Courier:</span>
                      <span className="text-gray-900 font-medium">{order.shipping.courier}</span>
                    </div>
                  )}
                  {order.shipping.tracking !== "Not available" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking:</span>
                      <span className="text-gray-900 font-medium">{order.shipping.tracking}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Payment Info</h5>
                  <div className="text-xs text-gray-600">
                    {order.paymentStatus === "completed" ? (
                      <span className="text-green-600">✓ Payment Completed</span>
                    ) : order.paymentStatus === "partially_paid" ? (
                      <span className="text-amber-600">⏳ Partially Paid</span>
                    ) : (
                      <span className="text-red-600">✗ Payment Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default OrderList;
