import { formatDate, getStatusColor } from "@/Utils/utils";
import { FiUser, FiEdit, FiTrash2, FiEye, FiUserCheck, FiUserX } from "react-icons/fi";

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
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          title="select user"
          type="checkbox"
          checked={selectedUsers.includes(user._id)}
          onChange={(e) => handleSelectUser(user._id, e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              <FiUser className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
              {user.name}
              {user.isVerified && (
                <span className="text-green-500" title="Email Verified">
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
          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            user.status
          )}`}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 capitalize">{user.role}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          ₦{user.walletAmount.toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">
          {user.subscribedToNewsLetter ? (
            <span className="text-green-600 font-medium">Subscribed</span>
          ) : (
            <span className="text-gray-500">Not Subscribed</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewUser(user)}
            className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details">
            <FiEye size={18} />
          </button>
          <button
            onClick={() => handleEditUser(user)}
            className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit User">
            <FiEdit size={18} />
          </button>
          {user.status === "active" ? (
            <button
              onClick={() => handleSuspendUser(user)}
              className="p-1.5 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors"
              title="Suspend User">
              <FiUserX size={18} />
            </button>
          ) : (
            <button
              onClick={() => handleActivateUser(user._id)}
              className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
              title="Activate User">
              <FiUserCheck size={18} />
            </button>
          )}
          <button
            onClick={() => handleDeleteUser(user._id)}
            className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete User">
            <FiTrash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CurrentUsersList;
