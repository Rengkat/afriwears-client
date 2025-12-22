import { getStatusColor } from "@/Utils/utils";
import React from "react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiLock,
  FiUnlock,
} from "react-icons/fi";

interface UserDetailModalProps {
  user: any;
  onClose: () => void;
  onEdit: (user: any) => void;
  onSuspend: () => void;
  onActivate: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  onClose,
  onEdit,
  onSuspend,
  onActivate,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusColor = user.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  const statusText = user.isVerified ? "Active" : "Inactive";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
          <button
            title="close"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg">
            <FiXCircle size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                {user.avatar ? (
                  <img
                    className="h-20 w-20 rounded-2xl object-cover"
                    src={user.avatar}
                    alt={`${user.firstName} ${user.surname}`}
                  />
                ) : (
                  <FiUser className="h-10 w-10 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-bold text-gray-900">
                    {user.firstName} {user.surname}
                  </h4>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                    {statusText}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMail className="h-4 w-4" />
                  <span>{user.email}</span>
                  {user.isVerified && (
                    <span className="text-green-500 ml-2" title="Email Verified">
                      <FiCheckCircle className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Information */}
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FiUser className="h-5 w-5 text-blue-500" />
                  Account Information
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">User ID</span>
                    <span className="text-sm font-medium text-gray-900 font-mono">
                      {user._id.substring(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Role</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Newsletter</span>
                    <span
                      className={`text-sm font-medium ${
                        user.subscribedToNewsLetter ? "text-green-600" : "text-gray-600"
                      }`}>
                      {user.subscribedToNewsLetter ? "Subscribed" : "Not Subscribed"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Information */}
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FiCalendar className="h-5 w-5 text-purple-500" />
                  Activity
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Joined Date</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(user.updatedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Company</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user.company ? "Associated" : "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Information */}
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiDollarSign className="h-5 w-5 text-green-500" />
                Wallet Information
              </h5>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      ₦{(user.walletAmount || 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Current balance</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <FiDollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onEdit(user)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2">
                  <FiEdit className="h-5 w-5" />
                  Edit User
                </button>
                {user.isVerified ? (
                  <button
                    onClick={onSuspend}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2">
                    <FiLock className="h-5 w-5" />
                    Suspend User
                  </button>
                ) : (
                  <button
                    onClick={onActivate}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2">
                    <FiUnlock className="h-5 w-5" />
                    Activate User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
