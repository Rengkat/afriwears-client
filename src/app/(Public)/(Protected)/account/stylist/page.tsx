"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiBox, FiDollarSign, FiUsers, FiTrendingUp } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

// Mock data for stylist dashboard
const mockData = {
  totalProducts: 24,
  pendingApproval: 3,
  totalOrders: 128,
  totalRevenue: 1250000,
  recentOrders: [
    { id: "ORD-7892", customer: "Jane Doe", amount: 35000, status: "processing" },
    { id: "ORD-6541", customer: "John Smith", amount: 42000, status: "shipped" },
    { id: "ORD-3214", customer: "Amina Yusuf", amount: 28000, status: "delivered" },
  ],
  performanceStats: {
    views: 1245,
    conversionRate: 3.2,
    avgOrderValue: 32500,
  },
};

const StylistDashboard = () => {
  const { user } = useSelector((store: RootState) => store.authSlice);
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.totalProducts}</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-full">
              <FiBox className="text-amber-600" size={24} />
            </div>
          </div>
          <Link
            href="/account/stylist/products"
            className="mt-4 inline-block text-sm font-medium text-amber-600 hover:text-amber-700">
            View all products
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.pendingApproval}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <FiBox className="text-blue-600" size={24} />
            </div>
          </div>
          <Link
            href="/account/stylist/products?status=pending"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
            Review products
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.totalOrders}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <FiTrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <Link
            href="/orders"
            className="mt-4 inline-block text-sm font-medium text-green-600 hover:text-green-700">
            View all orders
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₦{mockData.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-full">
              <FiDollarSign className="text-purple-600" size={24} />
            </div>
          </div>
          <Link
            href="/account/stylist/orders"
            className="mt-4 inline-block text-sm font-medium text-purple-600 hover:text-purple-700">
            View earnings
          </Link>
        </div>
      </div>

      {/* Recent Orders and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-lg text-gray-800">Recent Orders</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockData.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">#{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₦{order.amount.toLocaleString()}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/stylist/orders"
              className="mt-4 inline-block text-sm font-medium text-amber-600 hover:text-amber-700">
              View all orders
            </Link>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-lg text-gray-800">Performance</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Product Views</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.performanceStats.views}
                  </p>
                  <span className="text-sm text-green-600">+12% from last month</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.performanceStats.conversionRate}%
                  </p>
                  <span className="text-sm text-green-600">+1.2% from last month</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Average Order Value</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{mockData.performanceStats.avgOrderValue.toLocaleString()}
                  </p>
                  <span className="text-sm text-green-600">+8% from last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylistDashboard;
