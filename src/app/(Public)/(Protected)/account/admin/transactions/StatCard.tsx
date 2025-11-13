import { formatCurrency } from "@/utils";
import React from "react";
import { FiCheckCircle, FiCreditCard, FiDollarSign, FiTrendingUp } from "react-icons/fi";

const StatCard = ({
  totalTransactionsCount,
  totalVolume,
  completedTransactionsCount,
  successRate,
  pendingTransactionsCount,
}: any) => {
  //will add pending transactions card later
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{totalTransactionsCount}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            <FiCreditCard className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{completedTransactionsCount}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-full">
            <FiCheckCircle className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900">{successRate.toFixed(1)}%</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-full">
            <FiTrendingUp className="text-amber-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Volume</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalVolume)}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-full">
            <FiDollarSign className="text-purple-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
