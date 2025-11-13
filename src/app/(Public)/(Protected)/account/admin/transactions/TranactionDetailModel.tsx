import {
  formatCurrency,
  formatDate,
  getTransactionStatusColor,
  getTransactionTypeColor,
} from "@/utils";
import React from "react";
import { FiAlertCircle, FiUser, FiXCircle } from "react-icons/fi";

const TranactionDetailModel = ({
  setShowTransactionModal,
  selectedTransaction,
  handleRetryTransaction,
  handleRefundTransaction,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Transaction Details</h3>
            <button
              title="setShowTransactionModal"
              onClick={() => setShowTransactionModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiXCircle size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Transaction Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {selectedTransaction.reference}
                </h4>
                <p className="text-gray-600">{selectedTransaction.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTransactionTypeColor(
                    selectedTransaction.type
                  )}`}>
                  {selectedTransaction.type}
                </span>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTransactionStatusColor(
                    selectedTransaction.status
                  )}`}>
                  {selectedTransaction.status}
                </span>
              </div>
            </div>

            {/* Amount Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${
                    selectedTransaction.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}>
                  {selectedTransaction.type === "credit" ? "+" : "-"}{" "}
                  {formatCurrency(selectedTransaction.amount)}
                </div>
                <p className="text-gray-600 mt-1">Transaction Amount</p>
              </div>
            </div>

            {/* User Information */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">User Information</h5>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedTransaction.user.name}</p>
                    <p className="text-sm text-gray-600">{selectedTransaction.user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Transaction Details</h5>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Reference</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {selectedTransaction.reference}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Purpose</dt>
                    <dd className="text-sm font-medium text-gray-900 capitalize">
                      {selectedTransaction.metadata?.purpose?.replace("_", " ") || "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Created</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(selectedTransaction.createdAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Last Updated</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(selectedTransaction.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3">Balance Information</h5>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Previous Balance</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {formatCurrency(selectedTransaction.previousBalance)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Current Balance</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {formatCurrency(selectedTransaction.currentBalance)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Net Change</dt>
                    <dd
                      className={`text-sm font-medium ${
                        selectedTransaction.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}>
                      {selectedTransaction.type === "credit" ? "+" : "-"}{" "}
                      {formatCurrency(selectedTransaction.amount)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Metadata */}
            {selectedTransaction.metadata &&
              Object.keys(selectedTransaction.metadata).length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Additional Information</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dl className="space-y-2">
                      {Object.entries(selectedTransaction.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <dt className="text-sm text-gray-500 capitalize">
                            {key.replace("_", " ")}
                          </dt>
                          <dd className="text-sm text-gray-900">
                            {typeof value === "string" ? value : JSON.stringify(value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}

            {/* Failure Reason */}
            {selectedTransaction.status === "failed" &&
              selectedTransaction.metadata?.failure_reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle className="text-red-500" size={20} />
                    <h5 className="font-medium text-red-800">Failure Reason</h5>
                  </div>
                  <p className="text-red-700 mt-1">{selectedTransaction.metadata.failure_reason}</p>
                </div>
              )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowTransactionModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors">
                Close
              </button>
              {selectedTransaction.status === "failed" && (
                <button
                  onClick={() => {
                    handleRetryTransaction(selectedTransaction._id);
                    setShowTransactionModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">
                  Retry Transaction
                </button>
              )}
              {selectedTransaction.status === "completed" &&
                selectedTransaction.type === "debit" && (
                  <button
                    onClick={() => {
                      handleRefundTransaction(selectedTransaction);
                      setShowTransactionModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                    Process Refund
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranactionDetailModel;
