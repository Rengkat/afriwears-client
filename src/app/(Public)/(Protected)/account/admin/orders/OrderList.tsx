import {
  formatCurrency,
  formatDate,
  getPaymentStatusColor,
  getStatusColor,
  getStatusIcon,
} from "@/Utils/utils";
import React from "react";
import { FiCreditCard, FiEdit, FiEye, FiUser } from "react-icons/fi";

const OrderList = ({
  order,
  selectedOrders,
  handleSelectOrder,
  handleUpdateStatus,
  handleViewOrder,
}: any) => {
  return (
    <tr key={order._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          title="selectOrder"
          type="checkbox"
          checked={selectedOrders.includes(order._id)}
          onChange={(e) => handleSelectOrder(order._id, e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{order._id}</div>
          <div className="flex items-center gap-2 mt-1">
            {order.isCustomOrder && (
              <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                Custom
              </span>
            )}
            {order.awaitingBalancePayment && (
              <span className="inline-flex px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                Balance Due
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-8 w-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
            <FiUser className="h-4 w-4 text-gray-400" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
            <div className="text-xs text-gray-500">{order.customer.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}
        </div>
        <div className="text-xs text-gray-500">
          {order.orderItems.map((item: any) => item.product.name).join(", ")}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalPrice)}</div>
        {order.paymentInfo.paymentStatus === "partially_paid" && (
          <div className="text-xs text-amber-600">
            Paid: {formatCurrency(order.paymentInfo.amountPaid)}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {getStatusIcon(order.orderStatus)}
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
              order.orderStatus
            )}`}>
            {order.orderStatus}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <FiCreditCard className="text-gray-400" size={14} />
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
              order.paymentInfo.paymentStatus
            )}`}>
            {order.paymentInfo.paymentStatus}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1 capitalize">
          {order.paymentInfo.paymentMethod.replace("_", " ")}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(order.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewOrder(order)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="View Details">
            <FiEye size={16} />
          </button>
          <button
            onClick={() => handleUpdateStatus(order)}
            className="text-green-600 hover:text-green-900 transition-colors"
            title="Update Status">
            <FiEdit size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OrderList;
