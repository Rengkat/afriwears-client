import { FiLock, FiBell, FiCreditCard, FiShield, FiUsers, FiGlobe } from "react-icons/fi";

const Navigation = ({ setActiveTab, activeTab }: any) => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "general"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <FiGlobe
                  className={`${activeTab === "general" ? "text-blue-500" : "text-gray-400"}`}
                  size={20}
                />
                <span className="font-medium">General</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "security"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <FiLock
                  className={`${activeTab === "security" ? "text-blue-500" : "text-gray-400"}`}
                  size={20}
                />
                <span className="font-medium">Security</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "notifications"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <FiBell
                  className={`${activeTab === "notifications" ? "text-blue-500" : "text-gray-400"}`}
                  size={20}
                />
                <span className="font-medium">Notifications</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("payments")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "payments"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <FiCreditCard
                  className={`${activeTab === "payments" ? "text-blue-500" : "text-gray-400"}`}
                  size={20}
                />
                <span className="font-medium">Payments</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "users"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <FiUsers
                  className={`${activeTab === "users" ? "text-blue-500" : "text-gray-400"}`}
                  size={20}
                />
                <span className="font-medium">User Management</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
