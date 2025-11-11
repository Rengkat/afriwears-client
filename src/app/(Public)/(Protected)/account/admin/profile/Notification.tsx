import React from "react";
import { FiSave } from "react-icons/fi";

const Notification = ({
  notificationForm,
  handleSaveNotifications,
  handleNotificationChange,
}: any) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
        <button
          onClick={handleSaveNotifications}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
          <FiSave size={16} />
          Save Preferences
        </button>
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Security Alerts</p>
                <p className="text-sm text-gray-600">Important security notifications and alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title="securityAlert"
                  type="checkbox"
                  checked={notificationForm.email.securityAlerts}
                  onChange={(e) =>
                    handleNotificationChange("email", "securityAlerts", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">System Updates</p>
                <p className="text-sm text-gray-600">Platform updates and maintenance notices</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title="systemUpdates"
                  type="checkbox"
                  checked={notificationForm.email.systemUpdates}
                  onChange={(e) =>
                    handleNotificationChange("email", "systemUpdates", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">New User Registrations</p>
                <p className="text-sm text-gray-600">
                  Notifications when new users join the platform
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title="newUsers"
                  type="checkbox"
                  checked={notificationForm.email.newUsers}
                  onChange={(e) => handleNotificationChange("email", "newUsers", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Order Alerts</p>
                <p className="text-sm text-gray-600">
                  High-value or problematic order notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title="orderAlerts"
                  type="checkbox"
                  checked={notificationForm.email.orderAlerts}
                  onChange={(e) =>
                    handleNotificationChange("email", "orderAlerts", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Critical Alerts</p>
                <p className="text-sm text-gray-600">
                  Urgent system alerts requiring immediate attention
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title="criticalAlerts"
                  type="checkbox"
                  checked={notificationForm.push.criticalAlerts}
                  onChange={(e) =>
                    handleNotificationChange("push", "criticalAlerts", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">System Maintenance</p>
                <p className="text-sm text-gray-600">
                  Notifications about scheduled system maintenance
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  title="systemMaintenance"
                  type="checkbox"
                  checked={notificationForm.push.systemMaintenance}
                  onChange={(e) =>
                    handleNotificationChange("push", "systemMaintenance", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
