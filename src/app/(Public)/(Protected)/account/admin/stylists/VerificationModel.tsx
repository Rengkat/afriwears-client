import React from "react";

const VerificationModel = ({
  setShowVerificationModal,
  setStylists,
  stylists,
  selectedStylist,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify Stylist</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to verify {selectedStylist.name}? This will allow them to add
            products to the platform.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="verificationNotes"
                className="block text-sm font-medium text-gray-700 mb-1">
                Verification Notes (Optional)
              </label>
              <textarea
                id="verificationNotes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any notes about this verification..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Handle verification
                  setStylists(
                    stylists.map((s) =>
                      s._id === selectedStylist._id
                        ? {
                            ...s,
                            verificationStatus: "verified",
                            canAddProducts: true,
                          }
                        : s
                    )
                  );
                  setShowVerificationModal(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                Verify Stylist
              </button>
              <button
                onClick={() => setShowVerificationModal(false)}
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

export default VerificationModel;
