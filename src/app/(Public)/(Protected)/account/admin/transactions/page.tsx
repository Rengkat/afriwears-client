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
import StatCard from "./StatCard";
import FilterAndSearch from "./FilterAndSearch";
import TransactionTable from "./TransactionTable";
import TranactionDetailModel from "./TranactionDetailModel";

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
      <StatCard
        totalTransactionsCount={totalTransactionsCount}
        totalVolume={totalVolume}
        completedTransactionsCount={completedTransactionsCount}
        successRate={successRate}
      />
      {/* Filters and Search */}
      <FilterAndSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateRange={dateRange}
        setDateRange={setDateRange}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        purposeFilter={purposeFilter}
        setPurposeFilter={setPurposeFilter}
        selectedTransactions={selectedTransactions}
        handleBulkAction={handleBulkAction}
      />
      {/* Transactions Table */}
      <TransactionTable
        handleSelectAll={handleSelectAll}
        selectedTransactions={selectedTransactions}
        currentTransactions={currentTransactions}
        handleSelectTransaction={handleSelectTransaction}
        handleViewTransaction={handleViewTransaction}
        handleRetryTransaction={handleRetryTransaction}
        handleRefundTransaction={handleRefundTransaction}
        filteredTransactions={filteredTransactions}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        indexOfFirstTransaction={indexOfFirstTransaction}
        indexOfLastTransaction={indexOfLastTransaction}
        currentPage={currentPage}
      />

      {/* Transaction Detail Modal */}
      {showTransactionModal && selectedTransaction && (
        <TranactionDetailModel
          setShowTransactionModal={setShowTransactionModal}
          selectedTransaction={selectedTransaction}
          handleRetryTransaction={handleRetryTransaction}
          handleRefundTransaction={handleRefundTransaction}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
