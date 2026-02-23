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
import StatCard from "./StatCard";
import SearchAndFilter from "./SearchAndFilter";
import OrderTable from "./OrderTable";
import DetailOrder from "./DetailOrder";
import StatusModel from "./StatusModel.tsx";

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
      orders.map((o: any) =>
        o._id === selectedOrder._id
          ? {
              ...o,
              orderStatus: newStatus,
              updatedAt: new Date().toISOString(),
              ...(newStatus === "delivered" && { deliveredAt: new Date().toISOString() }),
            }
          : o,
      ),
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
              : o,
          ),
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
              : o,
          ),
        );
        setSelectedOrders([]);
        break;
      case "delivered":
        setOrders(
          orders.map((o: any) =>
            selectedOrders.includes(o._id)
              ? {
                  ...o,
                  orderStatus: "delivered",
                  deliveredAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : o,
          ),
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

  // Stats calculations
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === "pending").length;
  const processingOrdersCount = orders.filter((o) => o.orderStatus === "processing").length;
  const revenueTotal = orders
    .filter(
      (o) =>
        o.paymentInfo.paymentStatus === "completed" ||
        o.paymentInfo.paymentStatus === "partially_paid",
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
      <StatCard
        totalOrdersCount={totalOrdersCount}
        pendingOrdersCount={pendingOrdersCount}
        processingOrdersCount={processingOrdersCount}
        revenueTotal={revenueTotal}
      />
      {/* Filters and Search */}
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        selectedOrders={selectedOrders}
        handleBulkAction={handleBulkAction}
      />
      {/* Orders Table */}
      <OrderTable
        handleSelectAll={handleSelectAll}
        selectedOrders={selectedOrders}
        currentOrders={currentOrders}
        handleSelectOrder={handleSelectOrder}
        handleUpdateStatus={handleUpdateStatus}
        handleViewOrder={handleViewOrder}
        filteredOrders={filteredOrders}
        indexOfFirstOrder={indexOfFirstOrder}
        indexOfLastOrder={indexOfLastOrder}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />
      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <DetailOrder
          setShowOrderModal={setShowOrderModal}
          selectedOrder={selectedOrder}
          handleUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <StatusModel
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          handleConfirmStatusUpdate={handleConfirmStatusUpdate}
          setShowStatusModal={setShowStatusModal}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </div>
  );
};

export default AllOrdersPage;
