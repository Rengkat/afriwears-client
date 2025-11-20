import { formatDate, getStatusColor } from "@/Utils/utils";
import {
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiEye,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiCalendar,
  FiShoppingBag,
} from "react-icons/fi";

const CurrentUsersList = ({
  user,
  selectedUsers,
  handleSelectUser,
  handleViewUser,
  handleEditUser,
  handleSuspendUser,
  handleActivateUser,
  handleDeleteUser,
}: any) => {
  return (
    <tr key={user._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedUsers.includes(user._id)}
          onChange={(e) => handleSelectUser(user._id, e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
            ) : (
              <FiUserCheck className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.name}
              {user.isEmailVerified && (
                <span className="ml-1 text-green-500" title="Email Verified">
                  ✓
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            user.status
          )}`}>
          {user.status}
        </span>
        {user.suspensionReason && (
          <div className="text-xs text-gray-500 mt-1">{user.suspensionReason}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.ordersCount}</div>
        <div className="text-xs text-gray-500">orders</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          ₦{user.walletBalance.toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewUser(user)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="View Details">
            <FiEye size={16} />
          </button>
          <button
            onClick={() => handleEditUser(user)}
            className="text-green-600 hover:text-green-900 transition-colors"
            title="Edit User">
            <FiEdit size={16} />
          </button>
          {user.status === "active" ? (
            <button
              onClick={() => handleSuspendUser(user)}
              className="text-red-600 hover:text-red-900 transition-colors"
              title="Suspend User">
              <FiUserX size={16} />
            </button>
          ) : (
            <button
              onClick={() => handleActivateUser(user._id)}
              className="text-green-600 hover:text-green-900 transition-colors"
              title="Activate User">
              <FiUserCheck size={16} />
            </button>
          )}
          <button
            onClick={() => handleDeleteUser(user._id)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
            title="Delete User">
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CurrentUsersList;
