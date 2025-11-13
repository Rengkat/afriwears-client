"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FiUsers,
  FiBriefcase,
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiShoppingBag,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

// Mock data for admin dashboard
const mockData = {
  totalUsers: 1250,
  totalStylists: 89,
  pendingApprovals: 23,
  totalProducts: 456,
  totalRevenue: 4525000,
  pendingOrders: 15,
  recentActivities: [
    {
      id: 1,
      type: "product_approval",
      message: "New product submitted by Amina Couture",
      time: "5 min ago",
      status: "pending",
    },
    {
      id: 2,
      type: "stylist_verification",
      message: "Stylist verification request from John Fashion",
      time: "12 min ago",
      status: "pending",
    },
    {
      id: 3,
      type: "order_issue",
      message: "High value order #ORD-7892 requires attention",
      time: "25 min ago",
      status: "completed",
    },
    {
      id: 4,
      type: "user_registration",
      type: "user_registration",
      message: "50 new users registered today",
      time: "1 hour ago",
      status: "completed",
    },
  ],
  platformStats: {
    activeUsers: 845,
    conversionRate: 4.2,
    avgOrderValue: 28500,
    monthlyGrowth: 12.5,
  },
};

const AdminDashboard = () => {
  const { user } = useSelector((store: RootState) => store.authSlice);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "product_approval":
        return <FiPackage className="text-amber-500" />;
      case "stylist_verification":
        return <FiBriefcase className="text-blue-500" />;
      case "order_issue":
        return <FiShoppingBag className="text-red-500" />;
      case "user_registration":
        return <FiUsers className="text-green-500" />;
      default:
        return <FiTrendingUp className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.firstName}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockData.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <FiUsers className="text-blue-600" size={24} />
            </div>
          </div>
          <Link
            href="/account/admin/users"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
            Manage users
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stylists</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.totalStylists}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-full">
              <FiBriefcase className="text-purple-600" size={24} />
            </div>
          </div>
          <Link
            href="/account/admin/stylists"
            className="mt-4 inline-block text-sm font-medium text-purple-600 hover:text-purple-700">
            View stylists
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.pendingApprovals}</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-full">
              <FiCheckCircle className="text-amber-600" size={24} />
            </div>
          </div>
          <Link
            href="/account/admin/products?status=pending"
            className="mt-4 inline-block text-sm font-medium text-amber-600 hover:text-amber-700">
            Review approvals
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
            <div className="bg-green-50 p-3 rounded-full">
              <FiDollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <Link
            href="/account/admin/transactions"
            className="mt-4 inline-block text-sm font-medium text-green-600 hover:text-green-700">
            View transactions
          </Link>
        </div>
      </div>

      {/* Recent Activities and Platform Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-lg text-gray-800">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockData.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div className="p-2 bg-gray-50 rounded-lg">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          activity.status
                        )}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/admin/activities"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
              View all activities
            </Link>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-lg text-gray-800">Platform Statistics</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Users (30 days)</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.platformStats.activeUsers}
                  </p>
                  <span className="text-sm text-green-600">+8% from last month</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.platformStats.conversionRate}%
                  </p>
                  <span className="text-sm text-green-600">+0.8% from last month</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Average Order Value</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{mockData.platformStats.avgOrderValue.toLocaleString()}
                  </p>
                  <span className="text-sm text-green-600">+5% from last month</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Monthly Growth</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.platformStats.monthlyGrowth}%
                  </p>
                  <span className="text-sm text-green-600">On track</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-lg text-gray-800">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/account/admin/products?status=pending"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center">
              <FiPackage className="mx-auto text-blue-600 mb-2" size={24} />
              <p className="font-medium text-gray-900">Review Products</p>
              <p className="text-sm text-gray-500">{mockData.pendingApprovals} pending</p>
            </Link>

            <Link
              href="/account/admin/orders"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center">
              <FiShoppingBag className="mx-auto text-green-600 mb-2" size={24} />
              <p className="font-medium text-gray-900">Manage Orders</p>
              <p className="text-sm text-gray-500">{mockData.pendingOrders} pending</p>
            </Link>

            <Link
              href="/account/admin/stylists?status=pending"
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center">
              <FiBriefcase className="mx-auto text-purple-600 mb-2" size={24} />
              <p className="font-medium text-gray-900">Verify Stylists</p>
              <p className="text-sm text-gray-500">12 pending verification</p>
            </Link>

            <Link
              href="/account/admin/transactions"
              className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors text-center">
              <FiDollarSign className="mx-auto text-amber-600 mb-2" size={24} />
              <p className="font-medium text-gray-900">View Transactions</p>
              <p className="text-sm text-gray-500">Monitor payments</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
