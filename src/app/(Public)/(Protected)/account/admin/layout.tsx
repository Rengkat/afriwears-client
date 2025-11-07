"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiLogOut,
  FiMenu,
  FiBriefcase,
  FiSettings,
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiShield,
} from "react-icons/fi";
import { RiShoppingBagLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Mock admin data
const mockAdmin = {
  name: "Admin User",
  email: "admin@fashionapp.com",
  avatar: "/admin-avatar.jpg",
  role: "Super Administrator",
};

const AdminAccountLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  // Navigation items specific to admin
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiTrendingUp size={20} />, path: "/admin" },
    {
      id: "users",
      label: "User Management",
      icon: <FiUsers size={20} />,
      path: "/account/admin/users",
    },
    {
      id: "stylists",
      label: "Stylist Management",
      icon: <FiBriefcase size={20} />,
      path: "/account/admin/stylists",
    },
    {
      id: "products",
      label: "Product Approval",
      icon: <FiPackage size={20} />,
      path: "/account/admin/products",
    },
    {
      id: "orders",
      label: "All Orders",
      icon: <RiShoppingBagLine size={20} />,
      path: "/account/admin/orders",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: <FiDollarSign size={20} />,
      path: "/account/admin/transactions",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <FiUser size={20} />,
      path: "/account/admin/profile",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FiSettings size={20} />,
      path: "/account/admin/settings",
    },
  ];

  const handleLogout = () => {
    // In a real app, you would call your logout function here
    console.log("Admin logged out");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="text-gray-600 hover:text-gray-900">
          <FiMenu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-full lg:w-80">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Admin Profile Card */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                    <FiShield className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{mockAdmin.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{mockAdmin.role}</p>
                    <p className="text-xs text-gray-500">{mockAdmin.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          router.push(item.path);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === item.id
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}>
                        <span
                          className={`${
                            activeTab === item.id ? "text-blue-500" : "text-gray-400"
                          }`}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <FiLogOut size={20} className="text-gray-400" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileNavOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                  onClick={() => setIsMobileNavOpen(false)}
                />

                {/* Sidebar */}
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", ease: "easeInOut" }}
                  className="fixed inset-y-0 left-0 w-80 bg-white z-30 shadow-xl lg:hidden">
                  <div className="h-full flex flex-col">
                    {/* Admin Profile */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                          <FiShield className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{mockAdmin.name}</h3>
                          <p className="text-sm text-blue-600 font-medium">{mockAdmin.role}</p>
                          <p className="text-xs text-gray-500">{mockAdmin.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-2">
                      <ul className="space-y-1">
                        {navItems.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => {
                                setActiveTab(item.id);
                                router.push(item.path);
                                setIsMobileNavOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                activeTab === item.id
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}>
                              <span
                                className={`${
                                  activeTab === item.id ? "text-blue-500" : "text-gray-400"
                                }`}>
                                {item.icon}
                              </span>
                              <span className="font-medium">{item.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        <FiLogOut size={20} className="text-gray-400" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminAccountLayout;
