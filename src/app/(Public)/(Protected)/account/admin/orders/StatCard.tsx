import { formatCurrency } from "@/utils";
import React from "react";
import { FiClock, FiDollarSign, FiPackage, FiShoppingBag } from "react-icons/fi";

const StatCard = ({
  totalOrdersCount,
  pendingOrdersCount,
  processingOrdersCount,
  revenueTotal,
}: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{totalOrdersCount}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <FiShoppingBag className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{pendingOrdersCount}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-full">
            <FiClock className="text-amber-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Processing</p>
            <p className="text-2xl font-bold text-gray-900">{processingOrdersCount}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <FiPackage className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueTotal)}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-full">
            <FiDollarSign className="text-green-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
