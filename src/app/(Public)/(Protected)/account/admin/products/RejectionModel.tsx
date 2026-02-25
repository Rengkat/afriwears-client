import { FiAlertCircle } from "react-icons/fi";
interface RejectionModelProps {
  selectedProduct: { _id: string; name: string };
  setRejectionReason: (reason: string) => void;
  rejectionReason: string;
  setShowRejectionModal: (show: boolean) => void;
  handleConfirmRejection: () => void;
  setSelectedProduct: (product: null) => void;
}
const RejectionModel = ({
  selectedProduct,
  setRejectionReason,
  rejectionReason,
  setShowRejectionModal,
  handleConfirmRejection,
  setSelectedProduct,
}: RejectionModelProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiAlertCircle className="text-red-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Reject Product</h3>
          </div>

          <p className="text-gray-600 mb-4">
            Are you sure you want to reject <strong>"{selectedProduct.name}"</strong>? Please
            provide a reason for rejection that will be shared with the stylist.
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
                placeholder="Explain why this product is being rejected. This feedback will help the stylist improve their submissions."
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 10 characters required</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmRejection}
                disabled={!rejectionReason.trim() || rejectionReason.trim().length < 10}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed">
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason("");
                  setSelectedProduct(null);
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

export default RejectionModel;
