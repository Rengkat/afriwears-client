import React from "react";
import { FiCheck, FiClock, FiX } from "react-icons/fi";

interface VerificationSectionProps {
  stylist: any;
  isEditing: boolean;
}

const VerificationSection = ({ stylist, isEditing }: VerificationSectionProps) => {
  if (stylist.verificationStatus === "verified") {
    return null; // Don't show if verified
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Status</h3>

      <div
        className={`p-4 rounded-lg ${
          stylist.verificationStatus === "pending"
            ? "bg-amber-50 text-amber-800 border border-amber-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
        <div className="flex items-start gap-3">
          {stylist.verificationStatus === "pending" ? (
            <>
              <FiClock className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Verification Pending</h4>
                <p className="text-sm mt-1">
                  Your company documents are under review. This process typically takes 24-48 hours.
                  {stylist.cacCertificateNumber && (
                    <span className="block mt-1">
                      CAC Number:{" "}
                      <span className="font-medium">{stylist.cacCertificateNumber}</span>
                    </span>
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <FiX className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Verification Rejected</h4>
                <p className="text-sm mt-1">
                  {stylist.rejectionReason ||
                    "Your verification was rejected. Please ensure all documents are clear and valid."}
                </p>
                {stylist.cacCertificateNumber && (
                  <span className="block mt-1">
                    CAC Number: <span className="font-medium">{stylist.cacCertificateNumber}</span>
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isEditing && stylist.verificationStatus === "rejected" && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
          <p className="text-sm">
            <strong>Note:</strong> Update your information and documents, then contact support to
            request re-verification.
          </p>
        </div>
      )}
    </div>
  );
};

export default VerificationSection;
