import {
  formatCurrency,
  formatDate,
  getStatusIcon,
  getTransactionStatusColor,
  getTransactionStatusIcon,
  getTransactionTypeColor,
  getTypeIcon,
} from "@/Utils/utils";
import React from "react";
import { FiArrowUp, FiCreditCard, FiEye, FiRefreshCw, FiUser } from "react-icons/fi";

const TransactionTable = ({
  handleSelectAll,
  selectedTransactions,
  currentTransactions,
  handleSelectTransaction,
  handleViewTransaction,
  handleRetryTransaction,
  handleRefundTransaction,
  filteredTransactions,
  setCurrentPage,
  totalPages,
  indexOfFirstTransaction,
  indexOfLastTransaction,
  currentPage,
}: any) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  title="handleSelectAll"
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedTransactions.length === currentTransactions.length &&
                    currentTransactions.length > 0
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purpose
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTransactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    title="selectedTransactions"
                    type="checkbox"
                    checked={selectedTransactions.includes(transaction._id)}
                    onChange={(e) => handleSelectTransaction(transaction._id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{transaction.reference}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">
                      {transaction.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiUser className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.user.name}
                      </div>
                      <div className="text-xs text-gray-500">{transaction.user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm font-medium ${
                      transaction.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}>
                    {transaction.type === "credit" ? "+" : "-"} {formatCurrency(transaction.amount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Balance: {formatCurrency(transaction.currentBalance)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(transaction.type)}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeColor(
                        transaction.type
                      )}`}>
                      {transaction.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getTransactionStatusIcon(transaction.status)}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionStatusColor(
                        transaction.status
                      )}`}>
                      {transaction.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">
                    {transaction.metadata?.purpose?.replace("_", " ") || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View Details">
                      <FiEye size={16} />
                    </button>
                    {transaction.status === "failed" && (
                      <button
                        onClick={() => handleRetryTransaction(transaction._id)}
                        className="text-amber-600 hover:text-amber-900 transition-colors"
                        title="Retry Transaction">
                        <FiRefreshCw size={16} />
                      </button>
                    )}
                    {transaction.status === "completed" && transaction.type === "debit" && (
                      <button
                        onClick={() => handleRefundTransaction(transaction)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Process Refund">
                        <FiArrowUp size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {currentTransactions.length === 0 && (
        <div className="text-center py-12">
          <FiCreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filteredTransactions.length === 0
              ? "No transactions match your current filters."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstTransaction + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastTransaction, filteredTransactions.length)}
              </span>{" "}
              of <span className="font-medium">{filteredTransactions.length}</span> transactions
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border text-sm font-medium rounded-md ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}>
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
