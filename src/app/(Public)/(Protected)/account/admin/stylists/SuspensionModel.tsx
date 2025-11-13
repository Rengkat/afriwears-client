import React from "react";
import { FiAlertCircle } from "react-icons/fi";

const SuspensionModel = ({
  setShowSuspensionModal,
  selectedStylist,
  setStylists,
  stylists,
  suspensionReason,
  setSuspensionReason,
  setSelectedStylist,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiAlertCircle className="text-red-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Suspend Stylist</h3>
          </div>

          <p className="text-gray-600 mb-4">
            Are you sure you want to suspend <strong>"{selectedStylist.name}"</strong>? Please
            provide a reason for suspension that will be shared with the stylist.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="suspensionReason"
                className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Suspension *
              </label>
              <textarea
                id="suspensionReason"
                rows={4}
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain why this stylist is being suspended. This feedback will help them understand what needs improvement."
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 10 characters required</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!suspensionReason.trim() || suspensionReason.trim().length < 10) {
                    alert("Please provide a suspension reason with at least 10 characters");
                    return;
                  }
                  setStylists(
                    stylists.map((s) =>
                      s._id === selectedStylist._id
                        ? {
                            ...s,
                            status: "suspended",
                            suspensionReason: suspensionReason,
                            canAddProducts: false,
                          }
                        : s
                    )
                  );
                  setShowSuspensionModal(false);
                  setSuspensionReason("");
                  setSelectedStylist(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                Confirm Suspension
              </button>
              <button
                onClick={() => {
                  setShowSuspensionModal(false);
                  setSuspensionReason("");
                  setSelectedStylist(null);
                }}
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
