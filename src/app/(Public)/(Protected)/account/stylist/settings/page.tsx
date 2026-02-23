"use client";
import Link from "next/link";
import { useState } from "react";
import { FiLock, FiBell, FiCreditCard, FiShield } from "react-icons/fi";

const StylistSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      newOrders: true,
      productApprovals: true,
      reviews: true,
      promotions: false,
    },
    paymentMethod: "bank",
    bankDetails: {
      accountName: "Amina Couture Designs",
      accountNumber: "0123456789",
      bankName: "Zenith Bank",
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (type: keyof typeof formData.notifications) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };
  const handlePaymentMethodChange = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const handleBankDetailsChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Settings updated:", formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and security</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="p-2">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab("account")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "account"
                        ? "bg-amber-50 text-amber-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    <FiLock
                      className={`${activeTab === "account" ? "text-amber-500" : "text-gray-400"}`}
                      size={20}
                    />
                    <span className="font-medium">Account Security</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "notifications"
                        ? "bg-amber-50 text-amber-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    <FiBell
                      className={`${
                        activeTab === "notifications" ? "text-amber-500" : "text-gray-400"
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
                        ? "bg-amber-50 text-amber-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    <FiCreditCard
                      className={`${activeTab === "payments" ? "text-amber-500" : "text-gray-400"}`}
                      size={20}
                    />
                    <span className="font-medium">Payments</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("privacy")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "privacy"
                        ? "bg-amber-50 text-amber-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    <FiShield
                      className={`${activeTab === "privacy" ? "text-amber-500" : "text-gray-400"}`}
                      size={20}
                    />
                    <span className="font-medium">Privacy</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {activeTab === "account" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Security</h2>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters long and include a mix of letters,
                      numbers, and symbols.
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                      Update Password
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">New Orders</h3>
                      <p className="text-sm text-gray-500">
                        Get notified when you receive new orders
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        title="notification"
                        type="checkbox"
                        checked={formData.notifications.newOrders}
                        onChange={() => handleNotificationChange("newOrders")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Product Approvals</h3>
                      <p className="text-sm text-gray-500">
                        Get notified when your products are approved or rejected
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        title="notification"
                        type="checkbox"
                        checked={formData.notifications.productApprovals}
                        onChange={() => handleNotificationChange("productApprovals")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Reviews</h3>
                      <p className="text-sm text-gray-500">
                        Get notified when customers review your products
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        title="notification"
                        type="checkbox"
                        checked={formData.notifications.reviews}
                        onChange={() => handleNotificationChange("reviews")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Promotions</h3>
                      <p className="text-sm text-gray-500">
                        Get notified about platform promotions and discounts
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        title="notification"
                        type="checkbox"
                        checked={formData.notifications.promotions}
                        onChange={() => handleNotificationChange("promotions")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
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
                    <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handlePaymentMethodChange("bank")}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          formData.paymentMethod === "bank"
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}>
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              formData.paymentMethod === "bank"
                                ? "bg-amber-100 text-amber-600"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                            <FiCreditCard size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium">Bank Transfer</h4>
                            <p className="text-sm text-gray-500">Direct to your bank account</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePaymentMethodChange("wallet")}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          formData.paymentMethod === "wallet"
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}>
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              formData.paymentMethod === "wallet"
                                ? "bg-amber-100 text-amber-600"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                            <FiCreditCard size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium">Platform Wallet</h4>
                            <p className="text-sm text-gray-500">Withdraw anytime</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {formData.paymentMethod === "bank" && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Bank Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="accountName"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Account Name
                          </label>
                          <input
                            type="text"
                            id="accountName"
                            value={formData.bankDetails.accountName}
                            onChange={(e) => handleBankDetailsChange("accountName", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="accountNumber"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Account Number
                          </label>
                          <input
                            type="text"
                            id="accountNumber"
                            value={formData.bankDetails.accountNumber}
                            onChange={(e) =>
                              handleBankDetailsChange("accountNumber", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="bankName"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            id="bankName"
                            value={formData.bankDetails.bankName}
                            onChange={(e) => handleBankDetailsChange("bankName", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                      Save Payment Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Privacy Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Data Privacy</h3>
                    <p className="text-gray-600 mb-4">
                      We respect your privacy and are committed to protecting your personal data.
                      Your information is used only to provide and improve our services to you.
                    </p>
                    <Link
                      href="/privacy-policy"
                      className="text-amber-600 hover:text-amber-700 font-medium">
                      View our full Privacy Policy
                    </Link>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Data Export</h3>
                    <p className="text-gray-600 mb-4">
                      You can request a copy of all the personal data we have about you.
                    </p>
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                      Request Data Export
                    </button>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Account Deletion</h3>
                    <p className="text-gray-600 mb-4">
                      You can request to delete your account and all associated data. This action is
                      irreversible.
                    </p>
                    <button
                      type="button"
                      className="px-6 py-2 border border-red-300 text-red-700 font-medium rounded-lg shadow-sm hover:bg-red-50 transition-colors">
                      Request Account Deletion
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

export default StylistSettingsPage;
