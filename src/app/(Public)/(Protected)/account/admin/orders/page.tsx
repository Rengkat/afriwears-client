"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDollarSign,
  FiUser,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiAlertCircle,
  FiShoppingBag,
} from "react-icons/fi";

// Mock orders data based on your order schema
const mockOrders = [
  {
    _id: "ORD-7892",
    customer: {
      _id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
    },
    orderItems: [
      {
        _id: "item1",
        product: {
          _id: "prod1",
          name: "Premium African Print Dress",
          mainImage: "/product-1.jpg",
        },
        stylist: {
          _id: "stylist1",
          name: "Amina Couture",
        },
        quantity: 1,
        priceAtPurchase: 35000,
        orderType: "standard",
        status: "processing",
      },
    ],
    shippingAddress: {
      country: "Nigeria",
      state: "Lagos",
      city: "Lagos",
      street: "Victoria Island",
      postalCode: "101241",
      homeAddress: "123 Luxury Apartments",
      phone: "+2348012345678",
    },
    paymentInfo: {
      paymentMethod: "online",
      paymentStatus: "completed",
      amountPaid: 35000,
      balanceDue: 0,
      transactionId: "TXN-7892",
      paymentDate: "2024-03-20T10:30:00Z",
    },
    itemsPrice: 35000,
    taxPrice: 3500,
    shippingPrice: 1500,
    totalPrice: 40000,
    orderStatus: "processing",
    isCustomOrder: false,
    paidPercentage: 100,
    awaitingBalancePayment: false,
    createdAt: "2024-03-20T09:15:00Z",
    updatedAt: "2024-03-20T10:30:00Z",
  },
  {
    _id: "ORD-6541",
    customer: {
      _id: "2",
      name: "John Smith",
      email: "john@example.com",
    },
    orderItems: [
      {
        _id: "item2",
        product: {
          _id: "prod2",
          name: "Men's Corporate Agbada",
          mainImage: "/product-2.jpg",
        },
        stylist: {
          _id: "stylist2",
          name: "John Fashion",
        },
        quantity: 1,
        priceAtPurchase: 42000,
        orderType: "standard",
        status: "shipped",
      },
    ],
    shippingAddress: {
      country: "Nigeria",
      state: "Abuja",
      city: "Abuja",
      street: "Maitama",
      postalCode: "900001",
      homeAddress: "45 Presidential Estate",
      phone: "+2348098765432",
    },
    paymentInfo: {
      paymentMethod: "wallet",
      paymentStatus: "completed",
      amountPaid: 42000,
      balanceDue: 0,
      transactionId: "TXN-6541",
      paymentDate: "2024-03-19T14:20:00Z",
    },
    itemsPrice: 42000,
    taxPrice: 4200,
    shippingPrice: 1500,
    totalPrice: 47700,
    orderStatus: "shipped",
    isCustomOrder: false,
    paidPercentage: 100,
    awaitingBalancePayment: false,
    createdAt: "2024-03-19T13:45:00Z",
    updatedAt: "2024-03-20T08:30:00Z",
  },
  {
    _id: "ORD-3214",
    customer: {
      _id: "3",
      name: "Amina Yusuf",
      email: "amina@example.com",
    },
    orderItems: [
      {
        _id: "item3",
        product: {
          _id: "prod3",
          name: "Custom Wedding Dress",
          mainImage: "/product-3.jpg",
        },
        stylist: {
          _id: "stylist3",
          name: "Sarah Styles",
        },
        quantity: 1,
        priceAtPurchase: 28000,
        orderType: "custom",
        status: "delivered",
        measurements: {
          bustOrChest: 36,
          waist: 28,
          hips: 38,
        },
        paymentPlan: "partial",
        amountPaid: 16800,
        balanceDue: 11200,
      },
    ],
    shippingAddress: {
      country: "Nigeria",
      state: "Rivers",
      city: "Port Harcourt",
      street: "GRA Phase 2",
      postalCode: "500001",
      homeAddress: "78 Elegant Homes",
      phone: "+2348055555555",
    },
    paymentInfo: {
      paymentMethod: "online",
      paymentStatus: "partially_paid",
      amountPaid: 16800,
      balanceDue: 11200,
      transactionId: "TXN-3214",
      paymentDate: "2024-03-18T11:30:00Z",
    },
    itemsPrice: 28000,
    taxPrice: 2800,
    shippingPrice: 1500,
    totalPrice: 32300,
    orderStatus: "delivered",
    isCustomOrder: true,
    paidPercentage: 52,
    awaitingBalancePayment: true,
    deliveredAt: "2024-03-25T16:45:00Z",
    createdAt: "2024-03-18T10:15:00Z",
    updatedAt: "2024-03-25T16:45:00Z",
  },
  {
    _id: "ORD-9876",
    customer: {
      _id: "4",
      name: "David Brown",
      email: "david@example.com",
    },
    orderItems: [
      {
        _id: "item4",
        product: {
          _id: "prod4",
          name: "Casual Kaftan Dress",
          mainImage: "/product-4.jpg",
        },
        stylist: {
          _id: "stylist1",
          name: "Amina Couture",
        },
        quantity: 2,
        priceAtPurchase: 18000,
        orderType: "standard",
        status: "pending",
      },
      {
        _id: "item5",
        product: {
          _id: "prod5",
          name: "Traditional Blouse",
          mainImage: "/product-5.jpg",
        },
        stylist: {
          _id: "stylist5",
          name: "Elegance By Zara",
        },
        quantity: 1,
        priceAtPurchase: 15000,
        orderType: "standard",
        status: "pending",
      },
    ],
    shippingAddress: {
      country: "Nigeria",
      state: "Lagos",
      city: "Ikeja",
      street: "Allen Avenue",
      postalCode: "100001",
      homeAddress: "22 Business Plaza",
      phone: "+2348033333333",
    },
    paymentInfo: {
      paymentMethod: "cash_on_delivery",
      paymentStatus: "pending",
      amountPaid: 0,
      balanceDue: 0,
      transactionId: "TXN-9876",
    },
    itemsPrice: 51000,
    taxPrice: 5100,
    shippingPrice: 1500,
    totalPrice: 57600,
    orderStatus: "pending",
    isCustomOrder: false,
    paidPercentage: 0,
    awaitingBalancePayment: false,
    createdAt: "2024-03-20T15:20:00Z",
    updatedAt: "2024-03-20T15:20:00Z",
  },
  {
    _id: "ORD-5432",
    customer: {
      _id: "5",
      name: "Sarah Johnson",
      email: "sarah@example.com",
    },
    orderItems: [
      {
        _id: "item6",
        product: {
          _id: "prod6",
          name: "Bespoke Senator Outfit",
          mainImage: "/product-6.jpg",
        },
        stylist: {
          _id: "stylist4",
          name: "Mike Designs",
        },
        quantity: 1,
        priceAtPurchase: 55000,
        orderType: "custom",
        status: "processing",
        measurements: {
          bustOrChest: 42,
          waist: 36,
          hips: 40,
          shoulder: 18,
        },
        paymentPlan: "partial",
        amountPaid: 33000,
        balanceDue: 22000,
      },
    ],
    shippingAddress: {
      country: "Nigeria",
      state: "Oyo",
      city: "Ibadan",
      street: "Bodija Estate",
      postalCode: "200001",
      homeAddress: "15 Scholar's Lane",
      phone: "+2348077777777",
    },
    paymentInfo: {
      paymentMethod: "online",
      paymentStatus: "partially_paid",
      amountPaid: 33000,
      balanceDue: 22000,
      transactionId: "TXN-5432",
      paymentDate: "2024-03-19T16:45:00Z",
    },
    itemsPrice: 55000,
    taxPrice: 5500,
    shippingPrice: 1500,
    totalPrice: 62000,
    orderStatus: "processing",
    isCustomOrder: true,
    paidPercentage: 53,
    awaitingBalancePayment: true,
    createdAt: "2024-03-19T15:30:00Z",
    updatedAt: "2024-03-20T09:45:00Z",
  },
  {
    _id: "ORD-1111",
    customer: {
      _id: "6",
      name: "Michael Chen",
      email: "michael@example.com",
    },
    orderItems: [
      {
        _id: "item7",
        product: {
          _id: "prod7",
          name: "Traditional Weave Set",
          mainImage: "/product-7.jpg",
        },
        stylist: {
          _id: "stylist6",
          name: "Traditional Weaves",
        },
        quantity: 1,
        priceAtPurchase: 32000,
        orderType: "standard",
        status: "cancelled",
      },
    ],
    shippingAddress: {
      country: "Nigeria",
      state: "Kano",
      city: "Kano",
      street: "Nasarawa GRA",
      postalCode: "700001",
      homeAddress: "8 Cultural Heritage",
      phone: "+2348044444444",
    },
    paymentInfo: {
      paymentMethod: "online",
      paymentStatus: "refunded",
      amountPaid: 32000,
      balanceDue: 0,
      transactionId: "TXN-1111",
      paymentDate: "2024-03-17T12:00:00Z",
    },
    itemsPrice: 32000,
    taxPrice: 3200,
    shippingPrice: 1500,
    totalPrice: 36700,
    orderStatus: "cancelled",
    isCustomOrder: false,
    paidPercentage: 100,
    awaitingBalancePayment: false,
    createdAt: "2024-03-17T10:45:00Z",
    updatedAt: "2024-03-18T14:20:00Z",
  },
];

const AllOrdersPage = () => {
  const { user } = useSelector((store: RootState) => store.authSlice);
  const [orders, setOrders] = useState(mockOrders);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // Filter orders based on search and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.paymentInfo.paymentStatus === paymentFilter;
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "custom" && order.isCustomOrder) ||
      (typeFilter === "standard" && !order.isCustomOrder);

    return matchesSearch && matchesStatus && matchesPayment && matchesType;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Handle order actions
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateStatus = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setShowStatusModal(true);
  };

  const handleConfirmStatusUpdate = () => {
    if (!newStatus) return;

    setOrders(
      orders.map((o) =>
        o._id === selectedOrder._id
          ? {
              ...o,
              orderStatus: newStatus,
              updatedAt: new Date().toISOString(),
              ...(newStatus === "delivered" && { deliveredAt: new Date().toISOString() }),
            }
          : o
      )
    );

    setShowStatusModal(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const handleBulkAction = (action: string) => {
    if (selectedOrders.length === 0) return;

    switch (action) {
      case "processing":
        setOrders(
          orders.map((o) =>
            selectedOrders.includes(o._id)
              ? {
                  ...o,
                  orderStatus: "processing",
                  updatedAt: new Date().toISOString(),
                }
              : o
          )
        );
        setSelectedOrders([]);
        break;
      case "shipped":
        setOrders(
          orders.map((o) =>
            selectedOrders.includes(o._id)
              ? {
                  ...o,
                  orderStatus: "shipped",
                  updatedAt: new Date().toISOString(),
                }
              : o
          )
        );
        setSelectedOrders([]);
        break;
      case "delivered":
        setOrders(
          orders.map((o) =>
            selectedOrders.includes(o._id)
              ? {
                  ...o,
                  orderStatus: "delivered",
                  deliveredAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : o
          )
        );
        setSelectedOrders([]);
        break;
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(currentOrders.map((order) => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "partially_paid":
        return "bg-amber-100 text-amber-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-amber-500" size={16} />;
      case "processing":
        return <FiPackage className="text-blue-500" size={16} />;
      case "shipped":
        return <FiTruck className="text-purple-500" size={16} />;
      case "delivered":
        return <FiCheckCircle className="text-green-500" size={16} />;
      case "cancelled":
        return <FiXCircle className="text-red-500" size={16} />;
      default:
        return <FiShoppingBag className="text-gray-500" size={16} />;
    }
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
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === "pending").length;
  const processingOrdersCount = orders.filter((o) => o.orderStatus === "processing").length;
  const revenueTotal = orders
    .filter(
      (o) =>
        o.paymentInfo.paymentStatus === "completed" ||
        o.paymentInfo.paymentStatus === "partially_paid"
    )
    .reduce((sum, o) => sum + o.paymentInfo.amountPaid, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track all platform orders</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
              Export Orders
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Payment</option>
              <option value="completed">Completed</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">
              {selectedOrders.length} order(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("processing")}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors">
                Mark as Processing
              </button>
              <button
                onClick={() => handleBulkAction("shipped")}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded transition-colors">
                Mark as Shipped
              </button>
              <button
                onClick={() => handleBulkAction("delivered")}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors">
                Mark as Delivered
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedOrders.length === currentOrders.length && currentOrders.length > 0
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
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
              {currentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
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
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer.name}
                        </div>
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
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </div>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentOrders.length === 0 && (
          <div className="text-center py-12">
            <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filteredOrders.length === 0
                ? "No orders match your current filters."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastOrder, filteredOrders.length)}
                </span>{" "}
                of <span className="font-medium">{filteredOrders.length}</span> orders
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

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Order Details</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors">
                  <FiXCircle size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedOrder._id}</h4>
                    <p className="text-gray-600">Placed on {formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedOrder.isCustomOrder && (
                      <span className="inline-flex px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                        Custom Order
                      </span>
                    )}
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        selectedOrder.orderStatus
                      )}`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Customer Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedOrder.customer.name}
                      </p>
                      <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedOrder.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Shipping Address</h5>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FiMapPin className="text-gray-400 mt-1" size={18} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.customer.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.shippingAddress.homeAddress}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.shippingAddress.street}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.state}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.shippingAddress.country} -{" "}
                          {selectedOrder.shippingAddress.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Order Items</h5>
                  <div className="space-y-4">
                    {selectedOrder.orderItems.map((item: any) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.product.mainImage ? (
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={item.product.mainImage}
                              alt={item.product.name}
                            />
                          ) : (
                            <FiPackage className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{item.product.name}</p>
                              <p className="text-sm text-gray-600">By {item.stylist.name}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                <span className="text-sm text-gray-500">
                                  Price: {formatCurrency(item.priceAtPurchase)}
                                </span>
                                {item.orderType === "custom" && (
                                  <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                    Custom
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatCurrency(item.priceAtPurchase * item.quantity)}
                              </p>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  item.status
                                )}`}>
                                {item.status}
                              </span>
                            </div>
                          </div>

                          {/* Custom Order Details */}
                          {item.orderType === "custom" && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-900 mb-2">
                                Custom Order Details
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-500">Paid:</span>
                                  <span className="ml-1 font-medium">
                                    {formatCurrency(item.amountPaid)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Balance:</span>
                                  <span className="ml-1 font-medium">
                                    {formatCurrency(item.balanceDue)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Plan:</span>
                                  <span className="ml-1 font-medium capitalize">
                                    {item.paymentPlan}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Progress:</span>
                                  <span className="ml-1 font-medium">
                                    {Math.round(
                                      (item.amountPaid / (item.amountPaid + item.balanceDue)) * 100
                                    )}
                                    %
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Payment Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Payment Method</dt>
                          <dd className="text-sm font-medium text-gray-900 capitalize">
                            {selectedOrder.paymentInfo.paymentMethod.replace("_", " ")}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Payment Status</dt>
                          <dd className="text-sm">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                                selectedOrder.paymentInfo.paymentStatus
                              )}`}>
                              {selectedOrder.paymentInfo.paymentStatus}
                            </span>
                          </dd>
                        </div>
                        {selectedOrder.paymentInfo.transactionId && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-500">Transaction ID</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {selectedOrder.paymentInfo.transactionId}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    <div>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Items Total</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {formatCurrency(selectedOrder.itemsPrice)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Tax</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {formatCurrency(selectedOrder.taxPrice)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Shipping</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {formatCurrency(selectedOrder.shippingPrice)}
                          </dd>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2">
                          <dt className="text-sm font-medium text-gray-900">Total Amount</dt>
                          <dd className="text-sm font-bold text-gray-900">
                            {formatCurrency(selectedOrder.totalPrice)}
                          </dd>
                        </div>
                        {selectedOrder.paymentInfo.paymentStatus === "partially_paid" && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-amber-600">Balance Due</dt>
                            <dd className="text-sm font-medium text-amber-600">
                              {formatCurrency(selectedOrder.paymentInfo.balanceDue)}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      handleUpdateStatus(selectedOrder);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    Update Status
                  </button>
                  {selectedOrder.awaitingBalancePayment && (
                    <button className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">
                      Send Payment Reminder
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="orderStatus"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    id="orderStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {newStatus === "shipped" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <FiTruck className="text-blue-500" size={16} />
                      <p className="text-sm text-blue-700">
                        Customer will be notified when order is shipped
                      </p>
                    </div>
                  </div>
                )}

                {newStatus === "delivered" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-green-500" size={16} />
                      <p className="text-sm text-green-700">
                        Order will be marked as completed and delivery time recorded
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmStatusUpdate}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    Update Status
                  </button>
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setSelectedOrder(null);
                      setNewStatus("");
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrdersPage;
