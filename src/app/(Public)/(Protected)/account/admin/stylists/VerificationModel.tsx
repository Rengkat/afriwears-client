import React, { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface VerificationModelProps {
  setShowVerificationModal: (show: boolean) => void;
  selectedStylist: any;
  handleRejectStylist: (stylist: any) => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
}

const VerificationModel = ({
  setShowVerificationModal,
  selectedStylist,
  handleRejectStylist,
  rejectionReason,
  setRejectionReason,
}: VerificationModelProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReject = async () => {
    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      toast.error("Please provide a rejection reason with at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await handleRejectStylist(selectedStylist);
      setShowVerificationModal(false);
    } catch (error) {
      // Error is already handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiAlertCircle className="text-red-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Reject Stylist Verification</h3>
          </div>

          <p className="text-gray-600 mb-4">
            Are you sure you want to reject verification for{" "}
            <strong>"{selectedStylist.companyName || selectedStylist.name}"</strong>? Please provide
            a reason for rejection that will be shared with the stylist.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="rejectionReason"
                className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection *
              </label>
              <textarea
                id="rejectionReason"
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain why this stylist verification is being rejected. This feedback will help them understand what needs improvement."
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 10 characters required</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
              </button>
              <button
                onClick={() => setShowVerificationModal(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
