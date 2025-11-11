"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiDownload,
  FiDollarSign,
  FiUser,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiRefreshCw,
} from "react-icons/fi";

// Mock transactions data based on your transaction schema
const mockTransactions = [
  {
    _id: "TXN-7892",
    user: {
      _id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
    },
    amount: 35000,
    type: "debit",
    previousBalance: 150000,
    currentBalance: 115000,
    reference: "PAY_7892ABCD",
    description: "Payment for order ORD-7892",
    status: "completed",
    metadata: {
      purpose: "order_payment",
      orderId: "ORD-7892",
      verified_by: "webhook",
      verified_at: "2024-03-20T10:30:00Z",
    },
    createdAt: "2024-03-20T10:30:00Z",
    updatedAt: "2024-03-20T10:30:00Z",
  },
  {
    _id: "TXN-6541",
    user: {
      _id: "2",
      name: "John Smith",
      email: "john@example.com",
    },
    amount: 50000,
    type: "credit",
    previousBalance: 100000,
    currentBalance: 150000,
    reference: "WALLET_6541EFGH",
    description: "Wallet funding via Paystack",
    status: "completed",
    metadata: {
      purpose: "wallet_funding",
      payment_method: "paystack",
      verified_by: "manual",
      verified_at: "2024-03-19T14:20:00Z",
    },
    createdAt: "2024-03-19T14:20:00Z",
    updatedAt: "2024-03-19T14:20:00Z",
  },
  {
    _id: "TXN-3214",
    user: {
      _id: "3",
      name: "Amina Yusuf",
      email: "amina@example.com",
    },
    amount: 16800,
    type: "debit",
    previousBalance: 50000,
    currentBalance: 33200,
    reference: "CUSTOM_3214IJKL",
    description: "Partial payment for custom order ORD-3214",
    status: "completed",
    metadata: {
      purpose: "order_payment",
      orderId: "ORD-3214",
      order_type: "custom",
      payment_plan: "partial",
      verified_by: "webhook",
      verified_at: "2024-03-18T11:30:00Z",
    },
    createdAt: "2024-03-18T11:30:00Z",
    updatedAt: "2024-03-18T11:30:00Z",
  },
  {
    _id: "TXN-9876",
    user: {
      _id: "4",
      name: "David Brown",
      email: "david@example.com",
    },
    amount: 25000,
    type: "credit",
    previousBalance: 75000,
    currentBalance: 100000,
    reference: "WALLET_9876MNOP",
    description: "Wallet funding",
    status: "pending",
    metadata: {
      purpose: "wallet_funding",
      payment_method: "paystack",
    },
    createdAt: "2024-03-20T15:20:00Z",
    updatedAt: "2024-03-20T15:20:00Z",
  },
  {
    _id: "TXN-5432",
    user: {
      _id: "5",
      name: "Sarah Johnson",
      email: "sarah@example.com",
    },
    amount: 10000,
    type: "credit",
    previousBalance: 40000,
    currentBalance: 50000,
    reference: "WALLET_5432QRST",
    description: "Wallet funding failed",
    status: "failed",
    metadata: {
      purpose: "wallet_funding",
      payment_method: "paystack",
      failure_reason: "Insufficient funds",
      verified_at: "2024-03-19T16:45:00Z",
    },
    createdAt: "2024-03-19T16:45:00Z",
    updatedAt: "2024-03-19T16:45:00Z",
  },
  {
    _id: "TXN-1111",
    user: {
      _id: "6",
      name: "Michael Chen",
      email: "michael@example.com",
    },
    amount: 32000,
    type: "credit",
    previousBalance: 180000,
    currentBalance: 212000,
    reference: "REFUND_1111UVWX",
    description: "Refund for cancelled order ORD-1111",
    status: "completed",
    metadata: {
      purpose: "refund",
      orderId: "ORD-1111",
      refund_reason: "order_cancellation",
      verified_by: "manual",
      verified_at: "2024-03-18T14:20:00Z",
    },
    createdAt: "2024-03-18T14:20:00Z",
    updatedAt: "2024-03-18T14:20:00Z",
  },
  {
    _id: "TXN-2222",
    user: {
      _id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
    },
    amount: 45000,
    type: "debit",
    previousBalance: 115000,
    currentBalance: 70000,
    reference: "ORDER_2222YZAB",
    description: "Payment for order ORD-2222",
    status: "completed",
    metadata: {
      purpose: "order_payment",
      orderId: "ORD-2222",
      verified_by: "webhook",
      verified_at: "2024-03-17T09:15:00Z",
    },
    createdAt: "2024-03-17T09:15:00Z",
    updatedAt: "2024-03-17T09:15:00Z",
  },
  {
    _id: "TXN-3333",
    user: {
      _id: "7",
      name: "Elegance By Zara",
      email: "zara@elegance.com",
    },
    amount: 12500,
    type: "credit",
    previousBalance: 250000,
    currentBalance: 262500,
    reference: "SALE_3333CDEF",
    description: "Commission from sale",
    status: "completed",
    metadata: {
      purpose: "commission",
      orderId: "ORD-7892",
      commission_rate: "15%",
      verified_by: "system",
      verified_at: "2024-03-20T11:30:00Z",
    },
    createdAt: "2024-03-20T11:30:00Z",
    updatedAt: "2024-03-20T11:30:00Z",
  },
];

const TransactionsPage = () => {
  const { user } = useSelector((store: RootState) => store.authSlice);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesPurpose =
      purposeFilter === "all" || transaction.metadata?.purpose === purposeFilter;

    // Date range filter
    let matchesDate = true;
    if (dateRange.startDate || dateRange.endDate) {
      const transactionDate = new Date(transaction.createdAt);
      if (dateRange.startDate) {
        matchesDate = matchesDate && transactionDate >= new Date(dateRange.startDate);
      }
      if (dateRange.endDate) {
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && transactionDate <= endDate;
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesPurpose && matchesDate;
  });

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Handle transaction actions
  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleRetryTransaction = (transactionId: string) => {
    // In a real app, this would trigger a retry mechanism
    console.log("Retrying transaction:", transactionId);
    // Update transaction status to pending
    setTransactions(
      transactions.map((t) => (t._id === transactionId ? { ...t, status: "pending" } : t))
    );
  };

  const handleRefundTransaction = (transaction: any) => {
    // In a real app, this would trigger a refund process
    console.log("Processing refund for:", transaction._id);
    // Create a refund transaction
    const refundTransaction = {
      ...transaction,
      _id: `REFUND-${Date.now()}`,
      type: transaction.type === "credit" ? "debit" : "credit",
      description: `Refund: ${transaction.description}`,
      status: "pending",
      reference: `REFUND-${transaction.reference}`,
      metadata: {
        ...transaction.metadata,
        original_transaction: transaction._id,
        refund_reason: "admin_initiated",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions([refundTransaction, ...transactions]);
  };

  const handleBulkAction = (action: string) => {
    if (selectedTransactions.length === 0) return;

    switch (action) {
      case "export":
        // Export selected transactions
        console.log("Exporting transactions:", selectedTransactions);
        break;
      case "retry":
        // Retry failed transactions
        setTransactions(
          transactions.map((t) =>
            selectedTransactions.includes(t._id) && t.status === "failed"
              ? { ...t, status: "pending" }
              : t
          )
        );
        setSelectedTransactions([]);
        break;
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTransactions(currentTransactions.map((transaction) => transaction._id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (transactionId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, transactionId]);
    } else {
      setSelectedTransactions(selectedTransactions.filter((id) => id !== transactionId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "reversed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "credit":
        return "bg-green-100 text-green-800";
      case "debit":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FiCheckCircle className="text-green-500" size={16} />;
      case "pending":
        return <FiClock className="text-amber-500" size={16} />;
      case "failed":
        return <FiXCircle className="text-red-500" size={16} />;
      case "reversed":
        return <FiRefreshCw className="text-gray-500" size={16} />;
      default:
        return <FiCreditCard className="text-gray-500" size={16} />;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "credit" ? (
      <FiArrowUp className="text-green-500" size={16} />
    ) : (
      <FiArrowDown className="text-red-500" size={16} />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  // Stats calculations
  const totalTransactionsCount = transactions.length;
  const completedTransactionsCount = transactions.filter((t) => t.status === "completed").length;
  const pendingTransactionsCount = transactions.filter((t) => t.status === "pending").length;
  const totalVolume = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate success rate
  const successRate =
    totalTransactionsCount > 0 ? (completedTransactionsCount / totalTransactionsCount) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all financial transactions</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Filters and Search */}
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
              onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
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

      {/* Transactions Table */}
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
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.reference}
                      </div>
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
                      {transaction.type === "credit" ? "+" : "-"}{" "}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Balance: {formatCurrency(transaction.currentBalance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                          transaction.type
                        )}`}>
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
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

      {/* Transaction Detail Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Transaction Details</h3>
                <button
                  title="setShowTransactionModal"
                  onClick={() => setShowTransactionModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors">
                  <FiXCircle size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Transaction Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedTransaction.reference}
                    </h4>
                    <p className="text-gray-600">{selectedTransaction.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(
                        selectedTransaction.type
                      )}`}>
                      {selectedTransaction.type}
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        selectedTransaction.status
                      )}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>

                {/* Amount Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        selectedTransaction.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}>
                      {selectedTransaction.type === "credit" ? "+" : "-"}{" "}
                      {formatCurrency(selectedTransaction.amount)}
                    </div>
                    <p className="text-gray-600 mt-1">Transaction Amount</p>
                  </div>
                </div>

                {/* User Information */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">User Information</h5>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedTransaction.user.name}</p>
                        <p className="text-sm text-gray-600">{selectedTransaction.user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Transaction Details</h5>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Reference</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {selectedTransaction.reference}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Purpose</dt>
                        <dd className="text-sm font-medium text-gray-900 capitalize">
                          {selectedTransaction.metadata?.purpose?.replace("_", " ") || "N/A"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Created</dt>
                        <dd className="text-sm text-gray-900">
                          {formatDate(selectedTransaction.createdAt)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Last Updated</dt>
                        <dd className="text-sm text-gray-900">
                          {formatDate(selectedTransaction.updatedAt)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Balance Information</h5>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Previous Balance</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {formatCurrency(selectedTransaction.previousBalance)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Current Balance</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {formatCurrency(selectedTransaction.currentBalance)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Net Change</dt>
                        <dd
                          className={`text-sm font-medium ${
                            selectedTransaction.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}>
                          {selectedTransaction.type === "credit" ? "+" : "-"}{" "}
                          {formatCurrency(selectedTransaction.amount)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Metadata */}
                {selectedTransaction.metadata &&
                  Object.keys(selectedTransaction.metadata).length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Additional Information</h5>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <dl className="space-y-2">
                          {Object.entries(selectedTransaction.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <dt className="text-sm text-gray-500 capitalize">
                                {key.replace("_", " ")}
                              </dt>
                              <dd className="text-sm text-gray-900">
                                {typeof value === "string" ? value : JSON.stringify(value)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  )}

                {/* Failure Reason */}
                {selectedTransaction.status === "failed" &&
                  selectedTransaction.metadata?.failure_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <FiAlertCircle className="text-red-500" size={20} />
                        <h5 className="font-medium text-red-800">Failure Reason</h5>
                      </div>
                      <p className="text-red-700 mt-1">
                        {selectedTransaction.metadata.failure_reason}
                      </p>
                    </div>
                  )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowTransactionModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors">
                    Close
                  </button>
                  {selectedTransaction.status === "failed" && (
                    <button
                      onClick={() => {
                        handleRetryTransaction(selectedTransaction._id);
                        setShowTransactionModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">
                      Retry Transaction
                    </button>
                  )}
                  {selectedTransaction.status === "completed" &&
                    selectedTransaction.type === "debit" && (
                      <button
                        onClick={() => {
                          handleRefundTransaction(selectedTransaction);
                          setShowTransactionModal(false);
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                        Process Refund
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
