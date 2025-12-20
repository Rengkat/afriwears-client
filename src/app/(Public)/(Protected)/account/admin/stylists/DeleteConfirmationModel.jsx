import React, { useState } from "react";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";

const DeleteConfirmationModel = ({
  setShowDeleteModal,
  selectedStylist,
  deleteStylist,
  refetch,
  setSelectedStylists,
  selectedStylists,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const handleDelete = async () => {
    if (confirmationText.toLowerCase() !== "delete") {
      toast.error("Please type 'DELETE' to confirm deletion");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteStylist(selectedStylist._id).unwrap();
      toast.success("Stylist deleted successfully");
      refetch();

      // Update selected stylists if needed
      if (setSelectedStylists && selectedStylists) {
        setSelectedStylists(selectedStylists.filter((id) => id !== selectedStylist._id));
      }

      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete stylist");
    } finally {
      setIsDeleting(false);
      setConfirmationText("");
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    setShowDeleteModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Stylist</h3>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isDeleting}>
            <FiX className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Alert */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Warning: Critical Action</h4>
                <ul className="mt-2 text-xs text-red-700 space-y-1 list-disc list-inside">
                  <li>All products associated with this stylist will be removed</li>
                  <li>All orders from this stylist will be cancelled</li>
                  <li>The stylist account will be permanently deleted</li>
                  <li>This action cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stylist Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              {selectedStylist.avatar ? (
                <img
                  src={selectedStylist.avatar}
                  alt={selectedStylist.companyName}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <FiTrash2 className="h-5 w-5 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-900">{selectedStylist.companyName}</h4>
                <p className="text-sm text-gray-500">
                  {selectedStylist.owner?.firstName} {selectedStylist.owner?.surname}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Products:</span>
                <span className="font-medium ml-2">{selectedStylist.totalProducts || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="font-medium ml-2">{selectedStylist.status || "active"}</span>
              </div>
              <div>
                <span className="text-gray-500">Verification:</span>
                <span className="font-medium ml-2">{selectedStylist.verificationStatus}</span>
              </div>
              <div>
                <span className="text-gray-500">Rating:</span>
                <span className="font-medium ml-2">{selectedStylist.rating || 0}/5</span>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE here"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">
              This extra step prevents accidental deletion
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting || confirmationText.toLowerCase() !== "delete"}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="h-4 w-4" />
                  Delete Stylist
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModel;
