import { formatCurrency, formatDate, getStatusColor, getVerificationColor } from "@/Utils/utils";
import { FiAlertCircle, FiAward, FiMapPin, FiUserCheck, FiUserX, FiXCircle } from "react-icons/fi";
const StylistDetailModel = ({
  handleVerifyStylist,
  handleEditStylist,
  setShowStylistModal,
  selectedStylist,
  handleSuspendStylist,
  handleActivateStylist,
  handleApproveStylist,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Stylist Details</h3>
            <button
              title="showModel"
              onClick={() => setShowStylistModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiXCircle size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Stylist Header */}
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                {selectedStylist.avatar ? (
                  <img
                    className="h-24 w-24 rounded-full object-cover"
                    src={selectedStylist.avatar}
                    alt={selectedStylist.name}
                  />
                ) : (
                  <FiUserCheck className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-semibold text-gray-900">{selectedStylist.name}</h4>
                <p className="text-gray-600 mt-1">{selectedStylist.company}</p>
                <p className="text-gray-500">{selectedStylist.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getVerificationColor(
                      selectedStylist.verificationStatus
                    )}`}>
                    {selectedStylist.verificationStatus}
                  </span>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      selectedStylist.status
                    )}`}>
                    {selectedStylist.status}
                  </span>
                  {selectedStylist.canAddProducts && (
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                      Can Add Products
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h5 className="font-semibold text-gray-900 mb-4">Business Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FiMapPin className="text-gray-400" size={16} />
                      <p className="text-sm font-medium text-gray-900">
                        {selectedStylist.businessInfo.location}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FiAward className="text-gray-400" size={16} />
                      <p className="text-sm font-medium text-gray-900">
                        {selectedStylist.businessInfo.experience}
                      </p>
                    </div>
                  </div>
                  {selectedStylist.businessInfo.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedStylist.businessInfo.phone}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedStylist.businessInfo.description}
                  </p>
                </div>
              </div>

              {/* Specialties */}
              <div className="mt-4">
                <p className="text-sm text-gray-500">Specialties</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedStylist.businessInfo.specialties.map(
                    (specialty: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {specialty}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Website */}
              {selectedStylist.businessInfo.website && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Website</p>
                  <a
                    href={selectedStylist.businessInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 break-all">
                    {selectedStylist.businessInfo.website}
                  </a>
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Performance Metrics</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedStylist.totalProducts}
                  </div>
                  <p className="text-sm text-gray-600">Products</p>
                  {selectedStylist.pendingApproval > 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      {selectedStylist.pendingApproval} pending
                    </p>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedStylist.totalOrders}
                  </div>
                  <p className="text-sm text-gray-600">Orders</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedStylist.totalRevenue)}
                  </div>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {selectedStylist.rating}
                    </span>
                    <div className="text-amber-500">★</div>
                  </div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-xs text-gray-500">({selectedStylist.reviewCount} reviews)</p>
                </div>
              </div>
            </div>

            {/* Performance Details */}
            {selectedStylist.performance && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h5 className="font-semibold text-gray-900 mb-4">Service Performance</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedStylist.performance.completionRate}%
                    </div>
                    <p className="text-sm text-gray-600">Order Completion</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedStylist.performance.avgResponseTime}
                    </div>
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">
                      {selectedStylist.performance.customerSatisfaction}
                    </div>
                    <p className="text-sm text-gray-600">Customer Satisfaction</p>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection/Suspension Reason */}
            {(selectedStylist.rejectionReason || selectedStylist.suspensionReason) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <FiAlertCircle className="text-red-500" size={20} />
                  <h5 className="font-medium text-red-800">
                    {selectedStylist.rejectionReason ? "Rejection Reason" : "Suspension Reason"}
                  </h5>
                </div>
                <p className="text-red-700 mt-1">
                  {selectedStylist.rejectionReason || selectedStylist.suspensionReason}
                </p>
              </div>
            )}

            {/* Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Account Information</h5>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Joined Date</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(selectedStylist.joinedDate)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Last Login</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(selectedStylist.lastLogin)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Email Verified</dt>
                    <dd className="text-sm">
                      {selectedStylist.isEmailVerified ? (
                        <span className="text-green-600">Verified</span>
                      ) : (
                        <span className="text-amber-600">Pending</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEditStylist(selectedStylist)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Edit Stylist
              </button>
              {selectedStylist.verificationStatus === "pending" && (
                <button
                  onClick={() => {
                    handleApproveStylist(selectedStylist._id);
                    setShowStylistModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                  Verify Stylist
                </button>
              )}
              {selectedStylist.status === "active" ? (
                <button
                  onClick={() => {
                    handleSuspendStylist(selectedStylist);
                    setShowStylistModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                  Suspend Stylist
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleActivateStylist(selectedStylist._id);
                    setShowStylistModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                  Activate Stylist
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylistDetailModel;
