import { formatCurrency, getStatusColor, getVerificationColor } from "@/utils";
import { FiUserCheck, FiUserX } from "react-icons/fi";
const StylistDetailModel = ({
  handleVerifyStylist,
  handleEditStylist,
  setShowStylistModal,
  selectedStylist,
  handleSuspendStylist,
  handleActivateStylist,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Stylist Details</h3>
            <button
              onClick={() => setShowStylistModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiUserX size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Stylist Info */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                {selectedStylist.avatar ? (
                  <img
                    className="h-20 w-20 rounded-full"
                    src={selectedStylist.avatar}
                    alt={selectedStylist.name}
                  />
                ) : (
                  <FiUserCheck className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{selectedStylist.name}</h4>
                <p className="text-gray-600">{selectedStylist.company}</p>
                <p className="text-gray-500">{selectedStylist.email}</p>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVerificationColor(
                      selectedStylist.verificationStatus
                    )}`}>
                    {selectedStylist.verificationStatus}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedStylist.status
                    )}`}>
                    {selectedStylist.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Business Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedStylist.businessInfo.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedStylist.businessInfo.experience}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-sm text-gray-900">
                    {selectedStylist.businessInfo.description}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Specialties</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedStylist.businessInfo.specialties.map(
                      (specialty: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {specialty}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
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
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {selectedStylist.totalOrders}
                </div>
                <p className="text-sm text-gray-600">Orders</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(selectedStylist.totalRevenue)}
                </div>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-gray-900">{selectedStylist.rating}</span>
                  <div className="text-amber-500">★</div>
                </div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-xs text-gray-500">({selectedStylist.reviewCount} reviews)</p>
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
                    handleVerifyStylist(selectedStylist);
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
