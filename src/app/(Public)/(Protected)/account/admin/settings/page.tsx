"use client";
import { useState } from "react";
import { FiLock, FiBell, FiCreditCard, FiShield, FiUsers, FiGlobe } from "react-icons/fi";

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    // General Settings
    siteName: "FashionApp",
    siteDescription: "Premium African Fashion Marketplace",
    contactEmail: "admin@fashionapp.com",
    supportPhone: "+2348000000000",

    // Security Settings
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: true,

    // Notification Settings
    notifications: {
      newUsers: true,
      newStylists: true,
      productApprovals: true,
      highValueOrders: true,
      systemAlerts: true,
      securityBreaches: true,
    },

    // Payment Settings
    paymentSettings: {
      platformCommission: 15,
      autoApprovePayments: false,
      minimumPayout: 5000,
      payoutSchedule: "weekly",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handlePaymentSettingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      paymentSettings: {
        ...prev.paymentSettings,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Settings updated:", formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-1">Manage platform settings and configurations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
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
                      className={`${
                        activeTab === "notifications" ? "text-blue-500" : "text-gray-400"
                      }`}
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

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {activeTab === "general" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">General Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="siteName"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Site Name
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        name="siteName"
                        value={formData.siteName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contactEmail"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="siteDescription"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Site Description
                    </label>
                    <textarea
                      id="siteDescription"
                      name="siteDescription"
                      value={formData.siteDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="supportPhone"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Support Phone
                    </label>
                    <input
                      type="tel"
                      id="supportPhone"
                      name="supportPhone"
                      value={formData.supportPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                      Save General Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 12 characters long and include a mix of uppercase,
                      lowercase, numbers, and symbols.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.twoFactorAuth}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                      Update Security Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Notification Preferences
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">New User Registrations</h3>
                      <p className="text-sm text-gray-500">
                        Get notified when new users register on the platform
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.newUsers}
                        onChange={() => handleNotificationChange("newUsers")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">New Stylist Applications</h3>
                      <p className="text-sm text-gray-500">
                        Get notified when new stylists apply for verification
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.newStylists}
                        onChange={() => handleNotificationChange("newStylists")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Product Approval Requests</h3>
                      <p className="text-sm text-gray-500">
                        Get notified when stylists submit products for approval
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.productApprovals}
                        onChange={() => handleNotificationChange("productApprovals")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">High Value Orders</h3>
                      <p className="text-sm text-gray-500">
                        Get notified for orders above a certain threshold
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.highValueOrders}
                        onChange={() => handleNotificationChange("highValueOrders")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">System Alerts</h3>
                      <p className="text-sm text-gray-500">
                        Get notified about system maintenance and updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.systemAlerts}
                        onChange={() => handleNotificationChange("systemAlerts")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="platformCommission"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Platform Commission (%)
                    </label>
                    <input
                      type="number"
                      id="platformCommission"
                      value={formData.paymentSettings.platformCommission}
                      onChange={(e) =>
                        handlePaymentSettingChange("platformCommission", parseFloat(e.target.value))
                      }
                      min="0"
                      max="50"
                      step="0.5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Percentage taken by platform from each sale
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="minimumPayout"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Payout Amount (₦)
                    </label>
                    <input
                      type="number"
                      id="minimumPayout"
                      value={formData.paymentSettings.minimumPayout}
                      onChange={(e) =>
                        handlePaymentSettingChange("minimumPayout", parseFloat(e.target.value))
                      }
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="payoutSchedule"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Payout Schedule
                    </label>
                    <select
                      id="payoutSchedule"
                      value={formData.paymentSettings.payoutSchedule}
                      onChange={(e) => handlePaymentSettingChange("payoutSchedule", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Auto-approve Payments</h3>
                      <p className="text-sm text-gray-500">
                        Automatically approve successful payments without manual review
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.paymentSettings.autoApprovePayments}
                        onChange={() =>
                          handlePaymentSettingChange(
                            "autoApprovePayments",
                            !formData.paymentSettings.autoApprovePayments
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                      Save Payment Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  User Management Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">User Registration</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Require email verification
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Allow social media registration
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Require admin approval for new users
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Content Moderation</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Auto-flag inappropriate content
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Require review for all user reviews
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                      Save User Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
