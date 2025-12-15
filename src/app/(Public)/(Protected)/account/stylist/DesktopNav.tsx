import { stylistNavItems } from "@/Utils/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import StylistNav from "./StylistNav";
import Logout from "./Logout";

const DesktopNav = ({ stylist, setActiveTab, activeTab, handleLogout }: any) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Ensure this only runs on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted on client
  if (!mounted) {
    return (
      <aside className="hidden lg:block w-full lg:w-80">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full">
          {/* Loading skeleton */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:block w-full lg:w-80">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Stylist Profile Card */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={stylist?.avatar || "/avatar.jpg"}
                alt={stylist?.firstName || "User"}
                width={300}
                height={300}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {stylist?.firstName && stylist?.surname 
                  ? `${stylist.firstName} ${stylist.surname}`
                  : "Loading..."}
              </h3>
              <p className="text-sm text-gray-500">
                {stylist?.company?.companyName || "Stylist"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          <StylistNav
            stylistNavItems={stylistNavItems}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </nav>

        {/* Logout Button */}
        <Logout />
      </div>
    </aside>
  );
};

export default DesktopNav;