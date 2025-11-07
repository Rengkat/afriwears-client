"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut, FiMenu, FiBriefcase, FiSettings, FiPackage } from "react-icons/fi";
import { RiShoppingBagLine } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { stylistNavItems } from "@/utils";

// Mock stylist data
const mockStylist = {
  name: "Amina Couture",
  email: "amina@couture.com",
  avatar: "/stylist-avatar.jpg",
  company: "Amina Couture Designs",
};

const StylistAccountLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would call your logout function here
    console.log("Stylist logged out");
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
        <h1 className="text-xl font-bold text-gray-800">Stylist Dashboard</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-full lg:w-80">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Stylist Profile Card */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={mockStylist.avatar}
                      alt={mockStylist.name}
                      width={300}
                      height={300}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{mockStylist.name}</h3>
                    <p className="text-sm text-gray-500">{mockStylist.company}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                <ul className="space-y-1">
                  {stylistNavItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          router.push(item.path);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === item.id
                            ? "bg-amber-50 text-amber-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}>
                        <span
                          className={`${
                            activeTab === item.id ? "text-amber-500" : "text-gray-400"
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
                    {/* Stylist Profile */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden">
                          <Image
                            src={mockStylist.avatar}
                            alt={mockStylist.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{mockStylist.name}</h3>
                          <p className="text-sm text-gray-500">{mockStylist.company}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-2">
                      <ul className="space-y-1">
                        {stylistNavItems.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => {
                                setActiveTab(item.id);
                                router.push(item.path);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                activeTab === item.id
                                  ? "bg-amber-50 text-amber-600"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}>
                              <span
                                className={`${
                                  activeTab === item.id ? "text-amber-500" : "text-gray-400"
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

export default StylistAccountLayout;
