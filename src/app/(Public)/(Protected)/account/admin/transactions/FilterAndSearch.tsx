import React from "react";
import { FiSearch } from "react-icons/fi";

const FilterAndSearch = ({
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  purposeFilter,
  setPurposeFilter,
  selectedTransactions,
  handleBulkAction,
}: any) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search transactions by reference, user, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange((prev: any) => ({ ...prev, startDate: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange((prev: any) => ({ ...prev, endDate: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="End Date"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <select
            title="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="reversed">Reversed</option>
          </select>

          <select
            title="typeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>

          <select
            title="purposeFilter"
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Purposes</option>
            <option value="wallet_funding">Wallet Funding</option>
            <option value="order_payment">Order Payment</option>
            <option value="refund">Refund</option>
            <option value="commission">Commission</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setTypeFilter("all");
            setPurposeFilter("all");
            setDateRange({ startDate: "", endDate: "" });
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
          Clear Filters
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedTransactions.length > 0 && (
        <div className="mt-4 flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-900">
            {selectedTransactions.length} transaction(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("export")}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors">
              Export Selected
            </button>
            <button
              onClick={() => handleBulkAction("retry")}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded transition-colors">
              Retry Failed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterAndSearch;
