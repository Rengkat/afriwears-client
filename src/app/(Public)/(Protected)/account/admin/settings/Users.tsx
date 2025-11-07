import React from "react";

const Users = ({ handleSubmit }: any) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">User Management Settings</h2>
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
              <span className="ml-2 text-sm text-gray-700">Require email verification</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">Allow social media registration</span>
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
              <span className="ml-2 text-sm text-gray-700">Auto-flag inappropriate content</span>
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
  );
};

export default Users;
