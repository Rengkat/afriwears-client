import React, { useState } from "react";
import { FiX } from "react-icons/fi";

interface SuspensionModalProps {
  user: any;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const SuspensionModal: React.FC<SuspensionModalProps> = ({ user, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setIsSubmitting(true);
    await onConfirm(reason);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100">
                <FiX className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Suspend User</h3>
            </div>
            <button
              title="close"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiX size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">
                Suspending{" "}
                <span className="font-medium">
                  {user.firstName} {user.surname}
                </span>{" "}
                will:
              </p>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                  Prevent them from logging in
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                  Disable their account features
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                  Keep their data intact for reactivation
                </li>
              </ul>
            </div>

            <div>
              <label
                htmlFor="suspensionReason"
                className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Suspension <span className="text-red-500">*</span>
              </label>
              <textarea
                id="suspensionReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                placeholder="Please provide a detailed reason for suspending this user..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This reason will be recorded and may be shared with the user.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={!reason.trim() || isSubmitting}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  "Confirm Suspension"
                )}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspensionModal;
