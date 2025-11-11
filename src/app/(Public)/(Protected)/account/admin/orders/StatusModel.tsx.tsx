import React from "react";
import { FiCheckCircle, FiTruck } from "react-icons/fi";

const StatusModel = ({
  newStatus,
  setNewStatus,
  handleConfirmStatusUpdate,
  setShowStatusModal,
  setSelectedOrder,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                id="orderStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {newStatus === "shipped" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <FiTruck className="text-blue-500" size={16} />
                  <p className="text-sm text-blue-700">
                    Customer will be notified when order is shipped
                  </p>
                </div>
              </div>
            )}

            {newStatus === "delivered" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" size={16} />
                  <p className="text-sm text-green-700">
                    Order will be marked as completed and delivery time recorded
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleConfirmStatusUpdate}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Update Status
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedOrder(null);
                  setNewStatus("");
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

export default StatusModel;
