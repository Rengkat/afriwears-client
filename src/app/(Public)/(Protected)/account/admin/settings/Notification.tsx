import React from "react";

const Notification = ({ handleNotificationChange, formData }: any) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
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
              title="notification"
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
              title="notification"
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
              title="notification"
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
              title="notification"
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
              title="notification"
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
  );
};

export default Notification;
