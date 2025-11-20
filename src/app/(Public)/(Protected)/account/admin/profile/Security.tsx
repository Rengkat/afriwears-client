import { formatDateTime } from "@/Utils/utils";
import React from "react";

const Security = ({
  securityForm,
  handleSecurityChange,
  handleUpdatePassword,
  handleToggle2FA,
  admin,
}: any) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

      <div className="space-y-8">
        {/* Password Update */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-2">
                Current Password *
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={securityForm.currentPassword}
                onChange={handleSecurityChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter current password"
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={securityForm.newPassword}
                onChange={handleSecurityChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long and include a mix of letters, numbers,
                and symbols.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={securityForm.confirmPassword}
                onChange={handleSecurityChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              onClick={handleUpdatePassword}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Update Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">
                {securityForm.twoFactorEnabled
                  ? "Enabled - Extra security for your account"
                  : "Disabled - Add an extra layer of security"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                title="twoFactorEnabled"
                type="checkbox"
                checked={securityForm.twoFactorEnabled}
                onChange={handleToggle2FA}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Login History */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Login Activity</h3>
          <div className="space-y-3">
            {admin.security.loginHistory.map((login) => (
              <div
                key={login.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      login.status === "success" ? "bg-green-500" : "bg-red-500"
                    }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{login.device}</p>
                    <p className="text-sm text-gray-600">
                      {login.location} • {login.ip}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatDateTime(login.time)}</p>
                  <p
                    className={`text-xs ${
                      login.status === "success" ? "text-green-600" : "text-red-600"
                    }`}>
                    {login.status === "success" ? "Successful" : "Failed"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
            View Full Login History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Security;
