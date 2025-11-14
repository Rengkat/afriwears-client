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
import EmptyOder from "./EmptyOder";
import OrderList from "./OrderList";

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
                title="setFilter"
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
          <EmptyOder filter={filter} />
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
                    <OrderList
                      order={order}
                      toggleOrderExpand={toggleOrderExpand}
                      expandedOrder={expandedOrder}
                      updateOrderStatus={updateOrderStatus}
                    />
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
