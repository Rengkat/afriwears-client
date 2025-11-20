import { getStatusColor } from "@/Utils/utils";
import React from "react";
import { FiUserCheck, FiUserX } from "react-icons/fi";

const UserDetailModel = ({
  setShowUserModal,
  selectedUser,
  formatDate,
  handleEditUser,
  handleSuspendUser,
  handleActivateUser,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
            <button
              onClick={() => setShowUserModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiUserX size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                {selectedUser.avatar ? (
                  <img
                    className="h-16 w-16 rounded-full"
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                  />
                ) : (
                  <FiUserCheck className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h4>
                <p className="text-gray-600">{selectedUser.email}</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedUser.status
                  )} mt-1`}>
                  {selectedUser.status}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Account Information</h5>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">User ID</dt>
                    <dd className="text-sm text-gray-900">{selectedUser._id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Role</dt>
                    <dd className="text-sm text-gray-900 capitalize">{selectedUser.role}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Email Verified</dt>
                    <dd className="text-sm">
                      {selectedUser.isEmailVerified ? (
                        <span className="text-green-600">Verified</span>
                      ) : (
                        <span className="text-amber-600">Pending</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Activity</h5>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Joined Date</dt>
                    <dd className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Last Login</dt>
                    <dd className="text-sm text-gray-900">{formatDate(selectedUser.lastLogin)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Total Orders</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.ordersCount}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Wallet Information */}
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Wallet Information</h5>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  ₦{selectedUser.walletBalance.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Current balance</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEditUser(selectedUser)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Edit User
              </button>
              {selectedUser.status === "active" ? (
                <button
                  onClick={() => {
                    handleSuspendUser(selectedUser);
                    setShowUserModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                  Suspend User
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleActivateUser(selectedUser._id);
                    setShowUserModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                  Activate User
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModel;
