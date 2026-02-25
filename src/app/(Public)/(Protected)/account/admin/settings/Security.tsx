import React from "react";

const Security = ({ handleSubmit, formData, handleInputChange, setFormData }: any) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
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
            Password must be at least 12 characters long and include a mix of uppercase, lowercase,
            numbers, and symbols.
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
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
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              title="2fo"
              type="checkbox"
              checked={formData.twoFactorAuth}
              onChange={() =>
                setFormData((prev: any) => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))
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
  );
};

export default Security;
