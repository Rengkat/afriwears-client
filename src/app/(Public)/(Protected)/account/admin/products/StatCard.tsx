import React from "react";
import { FiCheckCircle, FiClock, FiPackage, FiXCircle } from "react-icons/fi";

const StatCard = ({ totalProductsCount, pendingCount, approvedCount, rejectedCount }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{totalProductsCount}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <FiPackage className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending Review</p>
            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-full">
            <FiClock className="text-amber-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-full">
            <FiCheckCircle className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-full">
            <FiXCircle className="text-red-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
