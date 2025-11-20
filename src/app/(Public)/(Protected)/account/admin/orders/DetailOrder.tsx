import { formatCurrency, formatDate, getPaymentStatusColor, getStatusColor } from "@/Utils/utils";
import React from "react";
import { FiMapPin, FiPackage, FiXCircle } from "react-icons/fi";

const DetailOrder = ({ setShowOrderModal, selectedOrder, handleUpdateStatus }: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Order Details</h3>
            <button
              title="showModel"
              onClick={() => setShowOrderModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiXCircle size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{selectedOrder._id}</h4>
                <p className="text-gray-600">Placed on {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                {selectedOrder.isCustomOrder && (
                  <span className="inline-flex px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                    Custom Order
                  </span>
                )}
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                    selectedOrder.orderStatus
                  )}`}>
                  {selectedOrder.orderStatus}
                </span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Customer Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="text-sm font-medium text-gray-900">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedOrder.shippingAddress.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Shipping Address</h5>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedOrder.customer.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.shippingAddress.homeAddress}
                    </p>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.street}</p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.shippingAddress.country} -{" "}
                      {selectedOrder.shippingAddress.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Order Items</h5>
              <div className="space-y-4">
                {selectedOrder.orderItems.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product.mainImage ? (
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={item.product.mainImage}
                          alt={item.product.name}
                        />
                      ) : (
                        <FiPackage className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-600">By {item.stylist.name}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                            <span className="text-sm text-gray-500">
                              Price: {formatCurrency(item.priceAtPurchase)}
                            </span>
                            {item.orderType === "custom" && (
                              <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                Custom
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(item.priceAtPurchase * item.quantity)}
                          </p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              item.status
                            )}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>

                      {/* Custom Order Details */}
                      {item.orderType === "custom" && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            Custom Order Details
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Paid:</span>
                              <span className="ml-1 font-medium">
                                {formatCurrency(item.amountPaid)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Balance:</span>
                              <span className="ml-1 font-medium">
                                {formatCurrency(item.balanceDue)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Plan:</span>
                              <span className="ml-1 font-medium capitalize">
                                {item.paymentPlan}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Progress:</span>
                              <span className="ml-1 font-medium">
                                {Math.round(
                                  (item.amountPaid / (item.amountPaid + item.balanceDue)) * 100
                                )}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Payment Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Payment Method</dt>
                      <dd className="text-sm font-medium text-gray-900 capitalize">
                        {selectedOrder.paymentInfo.paymentMethod.replace("_", " ")}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Payment Status</dt>
                      <dd className="text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                            selectedOrder.paymentInfo.paymentStatus
                          )}`}>
                          {selectedOrder.paymentInfo.paymentStatus}
                        </span>
                      </dd>
                    </div>
                    {selectedOrder.paymentInfo.transactionId && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Transaction ID</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {selectedOrder.paymentInfo.transactionId}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Items Total</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedOrder.itemsPrice)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Tax</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedOrder.taxPrice)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Shipping</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedOrder.shippingPrice)}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <dt className="text-sm font-medium text-gray-900">Total Amount</dt>
                      <dd className="text-sm font-bold text-gray-900">
                        {formatCurrency(selectedOrder.totalPrice)}
                      </dd>
                    </div>
                    {selectedOrder.paymentInfo.paymentStatus === "partially_paid" && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-amber-600">Balance Due</dt>
                        <dd className="text-sm font-medium text-amber-600">
                          {formatCurrency(selectedOrder.paymentInfo.balanceDue)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  handleUpdateStatus(selectedOrder);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Update Status
              </button>
              {selectedOrder.awaitingBalancePayment && (
                <button className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">
                  Send Payment Reminder
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;
