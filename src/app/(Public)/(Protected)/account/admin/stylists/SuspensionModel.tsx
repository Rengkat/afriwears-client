import React from "react";

const SuspensionModel = ({
  setShowSuspensionModal,
  selectedStylist,
  setStylists,
  stylists,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Suspend Stylist</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to suspend {selectedStylist.name}? Please provide a reason for
            suspension.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="suspensionReason"
                className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Suspension
              </label>
              <textarea
                id="suspensionReason"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the reason for suspending this stylist..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Handle suspension with reason
                  setStylists(
                    stylists.map((s) =>
                      s._id === selectedStylist._id
                        ? {
                            ...s,
                            status: "suspended",
                            canAddProducts: false,
                          }
                        : s
                    )
                  );
                  setShowSuspensionModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                Confirm Suspend
              </button>
              <button
                onClick={() => setShowSuspensionModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspensionModel;
