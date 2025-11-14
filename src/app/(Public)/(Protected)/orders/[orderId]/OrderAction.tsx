import React from "react";
import { FiCheckCircle, FiTruck } from "react-icons/fi";

const OrderAction = ({ order, updateOrderStatus, isUpdating }: any) => {
  return (
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
  );
};

export default OrderAction;
