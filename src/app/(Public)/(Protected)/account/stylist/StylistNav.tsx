import { useRouter } from "next/navigation";
import React from "react";

const StylistNav = ({ stylistNavItems, setActiveTab, activeTab }: any) => {
  const router = useRouter();
  return (
    <ul className="space-y-1">
      {stylistNavItems.map((item: any) => (
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
            <span className={`${activeTab === item.id ? "text-amber-500" : "text-gray-400"}`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default StylistNav;
