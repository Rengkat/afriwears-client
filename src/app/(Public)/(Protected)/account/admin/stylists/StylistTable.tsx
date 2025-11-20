import {
  formatCurrency,
  getStatusColor,
  getVerificationColor,
  getVerificationIcon,
} from "@/Utils/utils";
import React from "react";
import {
  FiCheckCircle,
  FiEdit,
  FiEye,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiXCircle,
} from "react-icons/fi";
import Pagination from "./Pagination";

const StylistTable = ({
  handleSelectAll,
  handleSelectStylist,
  selectedStylists,
  currentStylists,
  filteredStylists,
  indexOfLastStylist,
  indexOfFirstStylist,
  setCurrentPage,
  currentPage,
  totalPages,
  handleViewStylist,
  handleDeleteStylist,
  handleSuspendStylist,
  handleEditStylist,
  handleApproveStylist,
  handleRejectStylist,
  handleActivateStylist,
}: any) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  title="handleSelectAll"
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedStylists.length === currentStylists.length && currentStylists.length > 0
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stylist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStylists.map((stylist) => (
              <tr key={stylist._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    title="handleSelectStylist"
                    type="checkbox"
                    checked={selectedStylists.includes(stylist._id)}
                    onChange={(e) => handleSelectStylist(stylist._id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                      {stylist.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={stylist.avatar}
                          alt={stylist.name}
                        />
                      ) : (
                        <FiUserCheck className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {stylist.name}
                        {stylist.isEmailVerified && (
                          <span className="ml-1 text-green-500" title="Email Verified">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{stylist.company}</div>
                      <div className="text-xs text-gray-400">{stylist.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getVerificationIcon(stylist.verificationStatus)}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVerificationColor(
                        stylist.verificationStatus
                      )}`}>
                      {stylist.verificationStatus}
                    </span>
                  </div>
                  {stylist.rejectionReason && (
                    <div
                      className="text-xs text-gray-500 mt-1 max-w-xs truncate"
                      title={stylist.rejectionReason}>
                      {stylist.rejectionReason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      stylist.status
                    )}`}>
                    {stylist.status}
                  </span>
                  {stylist.suspensionReason && (
                    <div
                      className="text-xs text-gray-500 mt-1 max-w-xs truncate"
                      title={stylist.suspensionReason}>
                      {stylist.suspensionReason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{stylist.totalProducts}</div>
                  <div className="text-xs text-gray-500">
                    {stylist.pendingApproval > 0 && (
                      <span className="text-amber-600">{stylist.pendingApproval} pending</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(stylist.totalRevenue)}
                  </div>
                  <div className="text-xs text-gray-500">{stylist.totalOrders} orders</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-900">{stylist.rating}</span>
                    <div className="text-amber-500">★</div>
                    <div className="text-xs text-gray-500">({stylist.reviewCount})</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewStylist(stylist)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View Details">
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditStylist(stylist)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Edit Stylist">
                      <FiEdit size={16} />
                    </button>
                    {stylist.verificationStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleApproveStylist(stylist._id)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Approve Stylist">
                          <FiCheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleRejectStylist(stylist)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Reject Stylist">
                          <FiXCircle size={16} />
                        </button>
                      </>
                    )}
                    {stylist.status === "active" ? (
                      <button
                        onClick={() => handleSuspendStylist(stylist)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Suspend Stylist">
                        <FiUserX size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivateStylist(stylist._id)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Activate Stylist">
                        <FiUserCheck size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteStylist(stylist._id)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      title="Delete Stylist">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {currentStylists.length === 0 && (
        <div className="text-center py-12">
          <FiUserCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No stylists found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filteredStylists.length === 0
              ? "No stylists match your current filters."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          filteredStylists={filteredStylists}
          indexOfLastStylist={indexOfLastStylist}
          indexOfFirstStylist={indexOfFirstStylist}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default StylistTable;
