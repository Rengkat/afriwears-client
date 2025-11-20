"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut, FiMenu, FiBriefcase, FiSettings, FiPackage } from "react-icons/fi";
import { RiShoppingBagLine } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { stylistNavItems } from "@/utils";
import { useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "@/redux/services/AuthApiSlice";
import { RootState } from "@/redux/Store";
import DesktopNav from "./DesktopNav";
import StylistNav from "./StylistNav";
import Logout from "./Logout";

// Mock stylist data
const mockStylist = {
  name: "Amina Couture",
  email: "amina@couture.com",
  avatar: "/stylist-avatar.jpg",
  company: "Amina Couture Designs",
};

const StylistAccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { user: localUser } = useSelector((store: RootState) => store.authSlice);
  const { data, isLoading, isError } = useGetCurrentUserQuery(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();
  const user = data?.user || localUser;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          title="mobileNav"
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
          <DesktopNav stylist={user} setActiveTab={setActiveTab} activeTab={activeTab} />

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
                      <StylistNav
                        stylistNavItems={stylistNavItems}
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                      />
                    </nav>

                    {/* Logout Button */}
                    <Logout />
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
