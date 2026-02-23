"use client";
import { settingsDatat } from "@/Utils/utils";
import { useState } from "react";
import Navigation from "./Navigation";
import Security from "./Security";
import Notification from "./Notification";
import Payment from "./Payment";
import Users from "./Users";
import General from "./General";

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState(settingsDatat);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
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

  const handlePaymentSettingChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      paymentSettings: {
        ...prev.paymentSettings,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        <Navigation setActiveTab={setActiveTab} activeTab={activeTab} />
        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {activeTab === "general" && (
              <General
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                formData={formData}
              />
            )}

            {activeTab === "security" && (
              <Security
                handleSubmit={handleSubmit}
                formData={formData}
                handleInputChange={handleInputChange}
                setFormData={setFormData}
              />
            )}

            {activeTab === "notifications" && (
              <Notification
                handleNotificationChange={handleNotificationChange}
                formData={formData}
              />
            )}

            {activeTab === "payments" && (
              <Payment
                handleSubmit={handleSubmit}
                formData={formData}
                handlePaymentSettingChange={handlePaymentSettingChange}
              />
            )}

            {activeTab === "users" && <Users handleSubmit={handleSubmit} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
