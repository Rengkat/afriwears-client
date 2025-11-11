import { formatDate, formatDateTime } from "@/utils";
import Image from "next/image";
import React from "react";
import { FiBell, FiCamera, FiShield, FiUser } from "react-icons/fi";

const SideBar = ({ admin, handleAvatarChange, setActiveTab, activeTab }: any) => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Summary */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {admin.avatar ? (
                  <Image
                    src={admin.avatar}
                    alt={admin.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover"
                  />
                ) : (
                  <FiUser className="h-8 w-8 text-blue-600" />
                )}
              </div>
              <button
                title="uploadAvatar"
                onClick={() => document.getElementById("avatar-upload")?.click()}
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiCamera className="text-white" size={20} />
              </button>
              <input
                title="avaterUpload"
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{admin.name}</h3>
              <p className="text-blue-600 text-sm font-medium">{admin.role}</p>
              <p className="text-gray-500 text-sm">{admin.department}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <FiUser
                  className={`${activeTab === "profile" ? "text-blue-500" : "text-gray-400"}`}
                  size={20}
                />
                <span className="font-medium">Profile Information</span>
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
                <FiShield
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
          </ul>
        </nav>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Account Information</h4>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm text-gray-500">Member Since</dt>
            <dd className="text-sm font-medium text-gray-900">{formatDate(admin.joinDate)}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Last Login</dt>
            <dd className="text-sm font-medium text-gray-900">{formatDateTime(admin.lastLogin)}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Email Verification</dt>
            <dd className="text-sm">
              {admin.isEmailVerified ? (
                <span className="text-green-600 font-medium">Verified</span>
              ) : (
                <span className="text-amber-600 font-medium">Pending</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Phone Verification</dt>
            <dd className="text-sm">
              {admin.isPhoneVerified ? (
                <span className="text-green-600 font-medium">Verified</span>
              ) : (
                <span className="text-amber-600 font-medium">Pending</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default SideBar;
