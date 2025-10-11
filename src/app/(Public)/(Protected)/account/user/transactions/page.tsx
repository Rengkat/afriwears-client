"use client";
import { FiArrowDown, FiArrowUp, FiCreditCard, FiRefreshCw } from "react-icons/fi";
import { useGetMyTransactionsQuery } from "@/redux/services/TransactionApiSlice";
import { useState } from "react";

interface Transaction {
  _id: string;
  type: "credit" | "debit";
  amount: number;
  createdAt: string;
  description: string;
  status: "completed" | "pending" | "failed" | "reversed";
  reference: string;
  previousBalance: number;
  currentBalance: number;
}

interface ApiResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const TransactionHistory = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: response = {
      transactions: [],
      total: 0,
      page: 1,
      limit: limit,
      totalPages: 1,
    } as ApiResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetMyTransactionsQuery({ page, limit });

  const {
    transactions = [],
    total = 0,
    page: currentPage = 1,
    limit: currentLimit = limit,
    totalPages = 1,
  } = response;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "reversed":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Calculate showing range
  const startItem = (currentPage - 1) * currentLimit + 1;
  const endItem = Math.min(currentPage * currentLimit, total);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-full">
            <FiCreditCard className="text-amber-600 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600">All your wallet transactions</p>
          </div>
        </div>
        <button
          onClick={refetch}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          <FiRefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">No transactions found</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-5 md:col-span-6 font-medium text-gray-800">Transaction</div>
              <div className="col-span-3 md:col-span-2 font-medium text-gray-800 text-right">
                Amount
              </div>
              <div className="col-span-4 md:col-span-2 font-medium text-gray-800">Date</div>
              <div className="hidden md:col-span-2 font-medium text-gray-800 text-right">
                Status
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {transactions.map((transaction: any) => (
              <div key={transaction._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 md:col-span-6 flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "credit"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}>
                      {transaction.type === "credit" ? (
                        <FiArrowDown className="w-5 h-5" />
                      ) : (
                        <FiArrowUp className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">Ref: {transaction.reference}</p>
                    </div>
                  </div>
                  <div
                    className={`col-span-3 md:col-span-2 text-right font-medium ${
                      transaction.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}>
                    {transaction.type === "credit" ? "+" : "-"}₦
                    {transaction.amount.toLocaleString()}
                  </div>
                  <div className="col-span-4 md:col-span-2 text-sm text-gray-500">
                    {formatDate(transaction.createdAt)}
                  </div>
                  <div className="hidden md:col-span-2 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        transaction.status
                      )}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Balance: ₦{transaction.previousBalance.toLocaleString()} → ₦
                  {transaction.currentBalance.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{startItem}</span> to{" "}
              <span className="font-medium">{endItem}</span> of{" "}
              <span className="font-medium">{total}</span> transactions
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1 || isFetching}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || isFetching}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
