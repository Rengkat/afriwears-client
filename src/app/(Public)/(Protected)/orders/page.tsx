"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FiEye,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

// Mock data for stylist orders
const mockOrders = [
  {
    id: "ORD-7892",
    customer: "Jane Doe",
    date: "2023-05-15",
    amount: 35000,
    status: "processing",
    items: [
      { name: "Premium Ankara Jumpsuit", quantity: 1, price: 25000 },
      { name: "Matching Headwrap", quantity: 1, price: 10000 },
    ],
    shipping: {
      address: "123 Fashion St, Lagos Island, Lagos",
      courier: "DHL Express",
      tracking: "DL789456123NG",
    },
  },
  {
    id: "ORD-6541",
    customer: "John Smith",
    date: "2023-05-10",
    amount: 42000,
    status: "shipped",
    items: [
      { name: "Kente Agbada Set", quantity: 1, price: 35000 },
      { name: "Leather Sandals", quantity: 1, price: 7000 },
    ],
    shipping: {
      address: "45 Tailor Ave, Ikeja, Lagos",
      courier: "FedEx",
      tracking: "FX852369741NG",
    },
  },
  {
    id: "ORD-3214",
    customer: "Amina Yusuf",
    date: "2023-05-05",
    amount: 28000,
    status: "delivered",
    items: [
      { name: "Adire Wrap Dress", quantity: 1, price: 22000 },
      { name: "Beaded Necklace", quantity: 1, price: 6000 },
    ],
    shipping: {
      address: "8 Designer Close, Victoria Island, Lagos",
      courier: "UPS",
      tracking: "UP963258741NG",
    },
  },
];

const statusOptions = [
  { value: "all", label: "All Orders" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

const StylistOrdersPage = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 inline-flex items-center text-sm font-medium rounded-full";

    switch (status) {
      case "processing":
        return `${baseClasses} bg-amber-50 text-amber-800 border border-amber-200`;
      case "shipped":
        return `${baseClasses} bg-blue-50 text-blue-800 border border-blue-200`;
      case "delivered":
        return `${baseClasses} bg-green-50 text-green-800 border border-green-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-800 border border-gray-200`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <FiClock className="mr-2" size={14} />;
      case "shipped":
        return <FiTruck className="mr-2" size={14} />;
      case "delivered":
        return <FiCheckCircle className="mr-2" size={14} />;
      default:
        return null;
    }
  };

  const getStatusActions = (order) => {
    switch (order.status) {
      case "processing":
        return (
          <button
            onClick={() => updateOrderStatus(order.id, "shipped")}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FiTruck className="mr-1" size={12} />
            Mark as Shipped
          </button>
        );
      case "shipped":
        return (
          <button
            onClick={() => updateOrderStatus(order.id, "delivered")}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <FiCheckCircle className="mr-1" size={12} />
            Mark as Delivered
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">
              {orders.length} {orders.length === 1 ? "order" : "orders"} • ₦
              {orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()} total revenue
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <FiTruck className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "all" ? "No orders found" : `No ${filter} orders found`}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {filter === "all"
                ? "Try adjusting your search or filter criteria"
                : "All your orders are in a different status."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <>
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleOrderExpand(order.id)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              className="mr-2 text-gray-400 hover:text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOrderExpand(order.id);
                              }}>
                              {expandedOrder === order.id ? (
                                <FiChevronDown size={16} />
                              ) : (
                                <FiChevronRight size={16} />
                              )}
                            </button>
                            <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            ₦{order.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(order.status)}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center gap-3">
                            {getStatusActions(order)}
                            <Link
                              href={`/stylist/orders/${order.id}`}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="View Details"
                              onClick={(e) => e.stopPropagation()}>
                              <FiEye size={16} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                      {expandedOrder === order.id && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Items Ordered
                                </h4>
                                <ul className="space-y-2">
                                  {order.items.map((item, index) => (
                                    <li key={index} className="flex justify-between text-sm">
                                      <span className="text-gray-600">
                                        {item.quantity} × {item.name}
                                      </span>
                                      <span className="text-gray-900 font-medium">
                                        ₦{item.price.toLocaleString()}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Shipping Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Courier:</span>
                                    <span className="text-gray-900 font-medium">
                                      {order.shipping.courier}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Tracking Number:</span>
                                    <span className="text-gray-900 font-medium">
                                      {order.shipping.tracking}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Address:</p>
                                    <p className="text-gray-900 font-medium">
                                      {order.shipping.address}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StylistOrdersPage;
