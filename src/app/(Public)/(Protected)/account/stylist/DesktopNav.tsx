import { stylistNavItems } from "@/Utils/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FiLogOut } from "react-icons/fi";
import StylistNav from "./StylistNav";
import Logout from "./Logout";

const DesktopNav = ({ stylist, setActiveTab, activeTab, handleLogout }: any) => {
  const router = useRouter();
  return (
    <aside className="hidden lg:block w-full lg:w-80">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Stylist Profile Card */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={stylist.avatar}
                alt={stylist.firstName}
                width={300}
                height={300}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {stylist.firstName} {stylist.surname}
              </h3>
              <p className="text-sm text-gray-500">{stylist?.company?.companyName}</p>
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
